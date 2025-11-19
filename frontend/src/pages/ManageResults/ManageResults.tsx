import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Result, Village, Standard, CreateResultData } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Select from '../../components/common/Select/Select';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import FileUpload from '../../components/common/FileUpload/FileUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './ManageResults.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

const resultSchema = z.object({
  studentName: z.string().min(1, 'Student name is required').min(2, 'Minimum 2 characters required').max(100),
  standardId: z.string().refine((val) => val && val.length > 0 && val !== '', {
    message: 'Standard is required',
  }),
  medium: z.enum(['gujarati', 'english'], {
    errorMap: () => ({ message: 'Medium is required' }),
  }),
  totalMarks: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ required_error: 'Total marks is required', invalid_type_error: 'Total marks must be a number' })
      .min(1, 'Total marks must be at least 1')
      .max(10000)
  ),
  obtainedMarks: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ required_error: 'Obtained marks is required', invalid_type_error: 'Obtained marks must be a number' })
      .min(0, 'Obtained marks cannot be negative')
  ),
  percentage: z.number().min(0).max(100),
  villageId: z.string().refine((val) => val && val.length > 0 && val !== '', {
    message: 'Village is required',
  }),
  contactNumber: z.string().min(1, 'Contact number is required').regex(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits'),
  isApproved: z.boolean().default(false),
}).refine(
  (data) => {
    return data.obtainedMarks <= data.totalMarks;
  },
  {
    message: 'Obtained marks cannot exceed total marks',
    path: ['obtainedMarks'],
  }
);

type ResultFormData = z.infer<typeof resultSchema>;

const ManageResults: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [results, setResults] = useState<Result[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gujarati' | 'english'>('gujarati');
  const [filters, setFilters] = useState({
    standardId: '',
    villageId: '',
  });
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultImage, setResultImage] = useState<File | null>(null);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(null);
  const [autoOpenedResultId, setAutoOpenedResultId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const totalMarks = watch('totalMarks');
  const obtainedMarks = watch('obtainedMarks');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadResults();
  }, [activeTab, filters]);

  useEffect(() => {
    if (totalMarks && obtainedMarks !== undefined && totalMarks > 0 && !isNaN(totalMarks) && !isNaN(obtainedMarks)) {
      const calc = (obtainedMarks / totalMarks) * 100;
      const calculatedValue = parseFloat(calc.toFixed(2));
      setCalculatedPercentage(calculatedValue);
      setValue('percentage', calculatedValue, { shouldValidate: false });
    } else {
      setCalculatedPercentage(null);
      setValue('percentage', 0, { shouldValidate: false });
    }
  }, [totalMarks, obtainedMarks, setValue]);

  const loadData = async () => {
    try {
      const [villagesData, standardsData] = await Promise.all([
        villageApi.getAll(),
        standardApi.getAll(),
      ]);
      setVillages(villagesData);
      setStandards(standardsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const filtersToApply: any = {
        medium: activeTab,
        limit: 10000, // Get all results without pagination
      };
      if (filters.standardId) filtersToApply.standardId = filters.standardId;
      if (filters.villageId) filtersToApply.villageId = filters.villageId;
      
      const response = await resultApi.getAll(filtersToApply);
      setResults(response.data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
    setResultImage(null);
    setFullImageUrl(null);
    
    const standardId = typeof result.standardId === 'object' ? result.standardId._id : result.standardId;
    const villageId = typeof result.villageId === 'object' ? result.villageId._id : result.villageId;
    
    reset({
      studentName: result.studentName,
      standardId: standardId,
      medium: result.medium,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      percentage: result.percentage,
      villageId: villageId,
      contactNumber: result.contactNumber || '',
      isApproved: result.isApproved || false,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultId = params.get('resultId');

    if (resultId && autoOpenedResultId !== resultId && results.length > 0) {
      const targetResult = results.find((result) => result._id === resultId);
      if (targetResult) {
        handleEdit(targetResult);
        setAutoOpenedResultId(resultId);

        params.delete('resultId');
        const newSearch = params.toString();
        navigate(
          newSearch ? `${location.pathname}?${newSearch}` : location.pathname,
          { replace: true }
        );
      }
    }
  }, [location.search, results, autoOpenedResultId, navigate]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    setResultImage(null);
    setFullImageUrl(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('messages.confirm.deleteResult'))) {
      try {
        await resultApi.delete(id);
        showSuccess(t('messages.success.resultDeleted'));
        loadResults();
      } catch (error) {
        showError(t('messages.error.serverError'));
      }
    }
  };

  const onSubmit = async (data: ResultFormData, closeAfterSave: boolean = false) => {
    if (!selectedResult) return;
    
    setIsLoading(true);
    try {
      const resultData: Partial<CreateResultData> = {
        ...data,
      };
      if (resultImage) {
        resultData.resultImage = resultImage;
      }
      
      await resultApi.update(selectedResult._id, resultData);
      showSuccess(t('messages.success.resultUpdated'));
      
      // Reload results to get updated data
      const filtersToApply: any = {
        medium: activeTab,
        limit: 10000,
      };
      if (filters.standardId) filtersToApply.standardId = filters.standardId;
      if (filters.villageId) filtersToApply.villageId = filters.villageId;
      
      const response = await resultApi.getAll(filtersToApply);
      const updatedResults = response.data;
      setResults(updatedResults);
      
      // If save and close, close the modal
      if (closeAfterSave) {
        handleCloseModal();
      } else {
        // If just save, find the updated result and keep modal open
        const updatedResult = updatedResults.find(r => r._id === selectedResult._id);
        if (updatedResult) {
          setSelectedResult(updatedResult);
          // Reset form with updated data
          const standardId = typeof updatedResult.standardId === 'object' ? updatedResult.standardId._id : updatedResult.standardId;
          const villageId = typeof updatedResult.villageId === 'object' ? updatedResult.villageId._id : updatedResult.villageId;
          reset({
            studentName: updatedResult.studentName,
            standardId: standardId,
            medium: updatedResult.medium,
            totalMarks: updatedResult.totalMarks,
            obtainedMarks: updatedResult.obtainedMarks,
            percentage: updatedResult.percentage,
            villageId: villageId,
            contactNumber: updatedResult.contactNumber || '',
            isApproved: updatedResult.isApproved || false,
          });
          setResultImage(null); // Clear image selection after save
        }
      }
    } catch (error: any) {
      showError(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: ResultFormData) => {
    await onSubmit(data, false);
  };

  const handleSaveAndClose = async (data: ResultFormData) => {
    await onSubmit(data, true);
  };

  const getCurrentResultIndex = () => {
    if (!selectedResult) return -1;
    return sortedResults.findIndex(r => r._id === selectedResult._id);
  };

  const handleNext = () => {
    const currentIndex = getCurrentResultIndex();
    if (currentIndex >= 0 && currentIndex < sortedResults.length - 1) {
      const nextResult = sortedResults[currentIndex + 1];
      handleEdit(nextResult);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentResultIndex();
    if (currentIndex > 0) {
      const prevResult = sortedResults[currentIndex - 1];
      handleEdit(prevResult);
    }
  };

  const canNavigateNext = () => {
    const currentIndex = getCurrentResultIndex();
    return currentIndex >= 0 && currentIndex < sortedResults.length - 1;
  };

  const canNavigatePrevious = () => {
    const currentIndex = getCurrentResultIndex();
    return currentIndex > 0;
  };

  const handleImageClick = (imageUrl: string) => {
    setFullImageUrl(imageUrl);
  };

  const getStandardName = (result: Result) => {
    if (typeof result.standardId === 'object') {
      return result.standardId.standardName;
    }
    return '';
  };

  const getVillageName = (result: Result) => {
    if (typeof result.villageId === 'object') {
      return result.villageId.villageName;
    }
    return '';
  };

  const getImageUrl = (result: Result) => {
    if (result.resultImageUrl) {
      // Use relative URL so it goes through Vite proxy in development
      // resultImageUrl is already in format /uploads/results/filename.jpg
      return result.resultImageUrl;
    }
    return '';
  };

  const handleSortByPercentage = () => {
    if (sortOrder === null || sortOrder === 'desc') {
      setSortOrder('asc');
    } else {
      setSortOrder('desc');
    }
  };

  const sortedResults = React.useMemo(() => {
    if (sortOrder === null) {
      return results;
    }
    const sorted = [...results].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.percentage - b.percentage;
      } else {
        return b.percentage - a.percentage;
      }
    });
    return sorted;
  }, [results, sortOrder]);


  return (
    <Layout>
      <div className={styles.manageResults}>
        <div className={styles.controlsRow}>
          <div className={styles.tabs}>
            <button
              className={activeTab === 'gujarati' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('gujarati')}
            >
              {t('forms.gujarati')} {t('forms.medium')}
            </button>
            <button
              className={activeTab === 'english' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('english')}
            >
              {t('forms.english')} {t('forms.medium')}
            </button>
          </div>

          <div className={styles.filters}>
            <Select
              label={t('pages.results.filterByStandard')}
              options={[
                { value: '', label: t('pages.results.all') },
                ...standards.map((s) => ({
                  value: s._id,
                  label: s.standardName,
                })),
              ]}
              value={filters.standardId}
              onChange={(e) => setFilters({ ...filters, standardId: e.target.value })}
            />

            <Select
              label={t('pages.results.filterByVillage')}
              options={[
                { value: '', label: t('pages.results.all') },
                ...villages.map((v) => ({
                  value: v._id,
                  label: v.villageName,
                })),
              ]}
              value={filters.villageId}
              onChange={(e) => setFilters({ ...filters, villageId: e.target.value })}
            />
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{t('common.loading')}</div>
        ) : (
          <div className={styles.resultsTable}>
            <table>
              <thead>
                <tr>
                  <th>{t('pages.results.srNo')}</th>
                  <th>{t('pages.results.studentName')}</th>
                  <th>{t('pages.results.standard')}</th>
                  <th 
                    className={styles.sortableHeader}
                    onClick={handleSortByPercentage}
                  >
                    {t('pages.results.percentage')}
                    {sortOrder && (
                      <span className={styles.sortIndicator}>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>{t('pages.results.village')}</th>
                  <th>{t('pages.results.contact')}</th>
                  <th>Approved</th>
                  <th>{t('common.view')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.noData}>
                      {t('pages.results.noResults')}
                    </td>
                  </tr>
                ) : (
                  sortedResults.map((result, index) => (
                    <tr key={result._id}>
                      <td>{index + 1}</td>
                      <td>{result.studentName}</td>
                      <td>{getStandardName(result)}</td>
                      <td>{result.percentage.toFixed(2)}%</td>
                      <td>{getVillageName(result)}</td>
                      <td>{result.contactNumber || '-'}</td>
                      <td>
                        <span className={result.isApproved ? styles.approved : styles.notApproved}>
                          {result.isApproved ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {result.resultImageUrl && (
                          <img
                            src={getImageUrl(result)}
                            alt="Result"
                            className={styles.resultThumbnail}
                            onClick={() => handleImageClick(getImageUrl(result))}
                          />
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleEdit(result)}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDelete(result._id)}
                          >
                            {t('common.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && selectedResult && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{t('common.edit')}</h2>
                <div className={styles.modalHeaderRight}>
                  {sortedResults.length > 1 && (
                    <div className={styles.navigationButtons}>
                      <button
                        className={styles.navButton}
                        onClick={handlePrevious}
                        disabled={!canNavigatePrevious()}
                      >
                        {t('common.previous')}
                      </button>
                      <span className={styles.navInfo}>
                        {getCurrentResultIndex() + 1} / {sortedResults.length}
                      </span>
                      <button
                        className={styles.navButton}
                        onClick={handleNext}
                        disabled={!canNavigateNext()}
                      >
                        {t('common.next')}
                      </button>
                    </div>
                  )}
                  <button className={styles.closeButton} onClick={handleCloseModal}>
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalLeft}>
                  <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                      <Input
                        label={<>{t('forms.studentName')} <span className={styles.required}>*</span></>}
                        {...register('studentName')}
                        error={errors.studentName?.message}
                      />

                      <div className={styles.radioGroup}>
                        <label>{t('forms.medium')} <span className={styles.required}>*</span></label>
                        <div className={styles.radioOptions}>
                          <label>
                            <input
                              type="radio"
                              value="gujarati"
                              {...register('medium')}
                            />
                            {t('forms.gujarati')}
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="english"
                              {...register('medium')}
                            />
                            {t('forms.english')}
                          </label>
                        </div>
                        {errors.medium && <span className={styles.error}>{errors.medium.message}</span>}
                      </div>

                      <Select
                        label={<>{t('forms.standard')} <span className={styles.required}>*</span></>}
                        options={standards.map((s) => ({
                          value: s._id,
                          label: s.standardName,
                        }))}
                        {...register('standardId')}
                        error={errors.standardId?.message}
                      />

                      <div className={styles.marksSection}>
                        <Input
                          label={<>{t('forms.totalMarks')} <span className={styles.required}>*</span></>}
                          type="number"
                          step="1"
                          {...register('totalMarks', { 
                            valueAsNumber: true,
                            required: 'Total marks is required',
                          })}
                          error={errors.totalMarks?.message}
                        />
                        <Input
                          label={<>{t('forms.obtainedMarks')} <span className={styles.required}>*</span></>}
                          type="number"
                          step="0.01"
                          {...register('obtainedMarks', { 
                            valueAsNumber: true,
                            required: 'Obtained marks is required',
                          })}
                          error={errors.obtainedMarks?.message}
                        />
                      </div>

                      <Input
                        label={t('forms.percentage')}
                        type="number"
                        step="0.01"
                        {...register('percentage', { valueAsNumber: true })}
                        error={errors.percentage?.message}
                      />
                      {calculatedPercentage !== null && totalMarks && obtainedMarks && (
                        <p className={styles.calculatedNote}>
                          {t('pages.home.calculated')}: {calculatedPercentage.toFixed(2)}% (suggestion - you can edit the percentage above)
                        </p>
                      )}

                      <Select
                        label={<>{t('forms.village')} <span className={styles.required}>*</span></>}
                        options={villages.map((v) => ({
                          value: v._id,
                          label: v.villageName,
                        }))}
                        {...register('villageId')}
                        error={errors.villageId?.message}
                      />

                      <Input
                        label={<>{t('forms.contactNumber')} <span className={styles.required}>*</span></>}
                        type="tel"
                        maxLength={10}
                        {...register('contactNumber')}
                        error={errors.contactNumber?.message}
                      />

                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            {...register('isApproved')}
                          />
                          <span>Approved</span>
                        </label>
                      </div>

                      <FileUpload
                        label={t('forms.resultImage')}
                        onChange={setResultImage}
                        value={resultImage}
                      />

                      <div className={styles.modalActions}>
                        <Button 
                          type="button" 
                          variant="primary" 
                          onClick={handleSubmit(handleSave)}
                          isLoading={isLoading}
                        >
                          {t('common.save')}
                        </Button>
                        <Button 
                          type="button" 
                          variant="success" 
                          onClick={handleSubmit(handleSaveAndClose)}
                          isLoading={isLoading}
                        >
                          {t('common.saveAndClose')}
                        </Button>
                        <Button type="button" variant="danger" onClick={handleCloseModal}>
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                </div>
                <div className={styles.modalRight}>
                  {selectedResult.resultImageUrl && (
                    <img
                      src={getImageUrl(selectedResult)}
                      alt="Result"
                      className={styles.fullImage}
                      onClick={() => handleImageClick(getImageUrl(selectedResult))}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {fullImageUrl && (
          <div className={styles.imageModalOverlay} onClick={() => setFullImageUrl(null)}>
            <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeImageButton} onClick={() => setFullImageUrl(null)}>
                ×
              </button>
              <img src={fullImageUrl} alt="Full Result" className={styles.fullSizeImage} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageResults;

