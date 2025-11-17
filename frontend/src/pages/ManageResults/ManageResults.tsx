import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [resultImage, setResultImage] = useState<File | null>(null);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(null);

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

  const handleView = (result: Result) => {
    setSelectedResult(result);
    setIsEditMode(false);
    setIsModalOpen(true);
    setResultImage(null);
    setFullImageUrl(null);
    reset();
  };

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setIsEditMode(true);
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
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    setIsEditMode(false);
    setResultImage(null);
    setFullImageUrl(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultApi.delete(id);
        alert(t('messages.success.resultDeleted'));
        loadResults();
      } catch (error) {
        alert(t('messages.error.serverError'));
      }
    }
  };

  const onSubmit = async (data: ResultFormData) => {
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
      alert(t('messages.success.resultUpdated'));
      handleCloseModal();
      loadResults();
    } catch (error: any) {
      alert(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
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
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      // Remove /api from base URL since uploads are served directly
      const serverUrl = baseUrl.replace('/api', '');
      // resultImageUrl is already in format /uploads/results/filename.jpg
      return `${serverUrl}${result.resultImageUrl}`;
    }
    return '';
  };


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
                  <th>{t('pages.results.percentage')}</th>
                  <th>{t('pages.results.village')}</th>
                  <th>{t('pages.results.contact')}</th>
                  <th>{t('common.view')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.noData}>
                      {t('pages.results.noResults')}
                    </td>
                  </tr>
                ) : (
                  results.map((result, index) => (
                    <tr key={result._id}>
                      <td>{index + 1}</td>
                      <td>{result.studentName}</td>
                      <td>{getStandardName(result)}</td>
                      <td>{result.percentage.toFixed(2)}%</td>
                      <td>{getVillageName(result)}</td>
                      <td>{result.contactNumber || '-'}</td>
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
                            variant="success"
                            size="small"
                            onClick={() => handleView(result)}
                          >
                            {t('common.view')}
                          </Button>
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
                <h2>{isEditMode ? t('common.edit') : t('common.view')}</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalLeft}>
                  {isEditMode ? (
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                        readOnly={true}
                        disabled={true}
                      />
                      {calculatedPercentage !== null && (
                        <p className={styles.calculatedNote}>
                          {t('pages.home.calculated')}: {calculatedPercentage.toFixed(2)}%
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

                      <FileUpload
                        label={t('forms.resultImage')}
                        onChange={setResultImage}
                        value={resultImage}
                      />

                      <div className={styles.modalActions}>
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                          {t('common.save')}
                        </Button>
                        <Button type="button" variant="danger" onClick={handleCloseModal}>
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className={styles.viewDetails}>
                      <div className={styles.detailRow}>
                        <label>{t('forms.studentName')}:</label>
                        <span>{selectedResult.studentName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.medium')}:</label>
                        <span>{selectedResult.medium === 'gujarati' ? t('forms.gujarati') : t('forms.english')}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.standard')}:</label>
                        <span>{getStandardName(selectedResult)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.totalMarks')}:</label>
                        <span>{selectedResult.totalMarks || '-'}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.obtainedMarks')}:</label>
                        <span>{selectedResult.obtainedMarks || '-'}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.percentage')}:</label>
                        <span>{selectedResult.percentage.toFixed(2)}%</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.village')}:</label>
                        <span>{getVillageName(selectedResult)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>{t('forms.contactNumber')}:</label>
                        <span>{selectedResult.contactNumber || '-'}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <label>Submitted At:</label>
                        <span>{new Date(selectedResult.submittedAt).toLocaleString()}</span>
                      </div>
                      <div className={styles.modalActions}>
                        <Button variant="primary" onClick={() => handleEdit(selectedResult)}>
                          {t('common.edit')}
                        </Button>
                        <Button variant="danger" onClick={handleCloseModal}>
                          {t('common.close')}
                        </Button>
                      </div>
                    </div>
                  )}
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

