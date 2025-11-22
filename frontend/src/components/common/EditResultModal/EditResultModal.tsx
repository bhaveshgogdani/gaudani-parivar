import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '../../../i18n/useTranslation';
import { useToast } from '../../../context/ToastContext';
import { resultApi } from '../../../services/api/resultApi';
import { villageApi } from '../../../services/api/villageApi';
import { standardApi } from '../../../services/api/standardApi';
import { Result, Village, Standard, CreateResultData } from '../../../types/result.types';
import { getImageUrl } from '../../../utils/apiConfig';
import Input from '../Input/Input';
import Select from '../Select/Select';
import FileUpload from '../FileUpload/FileUpload';
import Button from '../Button/Button';
import ImageModal from '../ImageModal/ImageModal';
import styles from './EditResultModal.module.css';

const resultSchema = z.object({
  studentName: z.string().min(1, 'Student name is required').min(2, 'Minimum 2 characters required').max(100),
  standardId: z.string().optional(),
  otherStandardName: z.string().optional(),
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
).refine(
  (data) => {
    const hasStandard = data.standardId && data.standardId !== '' && data.standardId !== 'other';
    const hasOtherStandard = data.otherStandardName && typeof data.otherStandardName === 'string' && data.otherStandardName.trim().length >= 2;
    return hasStandard || hasOtherStandard;
  },
  {
    message: 'Either standard or other standard name is required',
    path: ['standardId'],
  }
).refine(
  (data) => {
    const hasStandard = data.standardId && data.standardId !== '' && data.standardId !== 'other';
    const hasOtherStandard = data.otherStandardName && typeof data.otherStandardName === 'string' && data.otherStandardName.trim().length >= 2;
    return !(hasStandard && hasOtherStandard);
  },
  {
    message: 'Cannot provide both standard and other standard name',
    path: ['standardId'],
  }
).refine(
  (data) => {
    if (data.otherStandardName && typeof data.otherStandardName === 'string' && data.otherStandardName.trim().length > 0) {
      return data.otherStandardName.trim().length >= 2 && data.otherStandardName.trim().length <= 100;
    }
    return true;
  },
  {
    message: 'Other standard name must be between 2 and 100 characters',
    path: ['otherStandardName'],
  }
);

type ResultFormData = z.infer<typeof resultSchema>;

interface EditResultModalProps {
  resultId?: string;
  result?: Result;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  showNavigation?: boolean;
  currentIndex?: number;
  totalCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  canNavigatePrevious?: () => boolean;
  canNavigateNext?: () => boolean;
}

const EditResultModal: React.FC<EditResultModalProps> = ({
  resultId,
  result: initialResult,
  isOpen,
  onClose,
  onSave,
  showNavigation = false,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  canNavigatePrevious,
  canNavigateNext,
}) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [result, setResult] = useState<Result | null>(initialResult || null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<File | null>(null);
  const [resultImage2, setResultImage2] = useState<File | null>(null);
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(null);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [fullImageUrl2, setFullImageUrl2] = useState<string | null>(null);

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
  const selectedStandardId = watch('standardId');
  const isOtherStandard = selectedStandardId === 'other';

  // Load result if only resultId is provided
  useEffect(() => {
    if (isOpen && resultId && !result) {
      const loadResult = async () => {
        try {
          const loadedResult = await resultApi.getById(resultId);
          setResult(loadedResult);
          populateForm(loadedResult);
        } catch (error) {
          console.error('Error loading result:', error);
          showError('Failed to load result');
        }
      };
      loadResult();
    } else if (isOpen && initialResult) {
      setResult(initialResult);
      populateForm(initialResult);
    }
  }, [isOpen, resultId, initialResult]);

  // Load villages and standards
  useEffect(() => {
    if (isOpen) {
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
      loadData();
    }
  }, [isOpen]);

  // Calculate percentage
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

  // Update form when result changes
  useEffect(() => {
    if (result && isOpen) {
      populateForm(result);
    }
  }, [result, isOpen]);

  const populateForm = (resultData: Result) => {
    const villageId = typeof resultData.villageId === 'object' ? resultData.villageId._id : resultData.villageId;
    
    let standardId: string;
    let otherStandardName: string | undefined;
    if (resultData.otherStandardName) {
      standardId = 'other';
      otherStandardName = resultData.otherStandardName;
    } else {
      standardId = typeof resultData.standardId === 'object' ? resultData.standardId._id : (resultData.standardId || '');
      otherStandardName = undefined;
    }
    
    reset({
      studentName: resultData.studentName,
      standardId: standardId,
      otherStandardName: otherStandardName,
      medium: resultData.medium,
      totalMarks: resultData.totalMarks,
      obtainedMarks: resultData.obtainedMarks,
      percentage: resultData.percentage,
      villageId: villageId,
      contactNumber: resultData.contactNumber || '',
      isApproved: resultData.isApproved || false,
    });
    setResultImage(null);
    setResultImage2(null);
  };

  const handleSave = async (data: ResultFormData, closeAfterSave: boolean = false) => {
    if (!result) return;
    
    setIsLoading(true);
    try {
      const resultData: Partial<CreateResultData> = {
        ...data,
      };
      
      // If "other" is selected, clear standardId and use otherStandardName
      if (data.standardId === 'other') {
        resultData.standardId = undefined;
        resultData.otherStandardName = data.otherStandardName;
      } else {
        // If a regular standard is selected, clear otherStandardName
        resultData.standardId = data.standardId;
        resultData.otherStandardName = undefined;
      }

      if (resultImage) {
        resultData.resultImage = resultImage;
      }
      if (resultImage2) {
        resultData.resultImage2 = resultImage2;
      }
      
      await resultApi.update(result._id, resultData);
      showSuccess(t('messages.success.resultUpdated'));
      
      // Reload the result to get updated data
      const updatedResult = await resultApi.getById(result._id);
      setResult(updatedResult);
      populateForm(updatedResult);
      
      if (onSave) {
        onSave();
      }
      
      if (closeAfterSave) {
        onClose();
      }
    } catch (error: any) {
      showError(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndClose = (data: ResultFormData) => {
    handleSave(data, true);
  };

  const handleClose = () => {
    reset();
    setResultImage(null);
    setResultImage2(null);
    setFullImageUrl(null);
    setFullImageUrl2(null);
    onClose();
  };

  const getResultImageUrl = (resultData: Result) => getImageUrl(resultData.resultImageUrl);
  const getResultImage2Url = (resultData: Result) => resultData.resultImage2Url ? getImageUrl(resultData.resultImage2Url) : null;

  const handleImageClick = (resultData: Result) => {
    setFullImageUrl(resultData.resultImageUrl ? getResultImageUrl(resultData) : null);
    setFullImageUrl2(resultData.resultImage2Url ? getResultImage2Url(resultData)! : null);
  };

  if (!isOpen || !result) {
    return null;
  }

  return (
    <>
      <div className={styles.modalOverlay} onClick={handleClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>{t('common.edit')}</h2>
            <div className={styles.modalHeaderRight}>
              {showNavigation && totalCount && totalCount > 1 && (
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={onPrevious}
                    disabled={!canNavigatePrevious || !canNavigatePrevious()}
                  >
                    {t('common.previous')}
                  </button>
                  <span className={styles.navInfo}>
                    {(currentIndex ?? 0) + 1} / {totalCount}
                  </span>
                  <button
                    className={styles.navButton}
                    onClick={onNext}
                    disabled={!canNavigateNext || !canNavigateNext()}
                  >
                    {t('common.next')}
                  </button>
                </div>
              )}
              <button className={styles.closeButton} onClick={handleClose}>
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
                  options={[
                    ...standards.map((s) => ({
                      value: s._id,
                      label: s.standardName,
                    })),
                    {
                      value: 'other',
                      label: t('forms.otherStandard'),
                    },
                  ]}
                  {...register('standardId', {
                    onChange: (e) => {
                      const value = e.target.value;
                      if (value !== 'other') {
                        setValue('otherStandardName', '');
                      }
                    },
                  })}
                  error={errors.standardId?.message}
                />

                {isOtherStandard && (
                  <Input
                    label={<>{t('forms.otherStandardName')} <span className={styles.required}>*</span></>}
                    {...register('otherStandardName')}
                    error={errors.otherStandardName?.message}
                    placeholder={t('forms.otherStandardPlaceholder')}
                  />
                )}

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

                <FileUpload
                  label={t('forms.resultImage2')}
                  onChange={setResultImage2}
                  value={resultImage2}
                />

                <div className={styles.modalActions}>
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={handleSubmit((data) => handleSave(data, false))}
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
                  <Button type="button" variant="danger" onClick={handleClose}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </div>
            <div className={styles.modalRight}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.resultImageUrl && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Result Image 1</label>
                    <img
                      src={getResultImageUrl(result)}
                      alt="Result 1"
                      className={styles.fullImage}
                      onClick={() => handleImageClick(result)}
                    />
                  </div>
                )}
                {result.resultImage2Url && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Result Image 2</label>
                    <img
                      src={getResultImage2Url(result)!}
                      alt="Result 2"
                      className={styles.fullImage}
                      onClick={() => handleImageClick(result)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {fullImageUrl && (
        <ImageModal
          imageUrl={fullImageUrl}
          imageUrl2={fullImageUrl2 || undefined}
          onClose={() => {
            setFullImageUrl(null);
            setFullImageUrl2(null);
          }}
          alt="Result Image 1"
          alt2="Result Image 2"
        />
      )}
    </>
  );
};

export default EditResultModal;

