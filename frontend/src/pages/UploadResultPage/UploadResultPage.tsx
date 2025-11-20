import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { adminApi } from '../../services/api/adminApi';
import { Village, Standard, CreateResultData } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import FileUpload from '../../components/common/FileUpload/FileUpload';
import Button from '../../components/common/Button/Button';
import styles from './UploadResultPage.module.css';

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

const UploadResultPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { showError, showWarning } = useToast();
  const navigate = useNavigate();
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadClosed, setIsUploadClosed] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [resultImage, setResultImage] = useState<File | null>(null);
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
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onChange', // Re-validate on change after first error
    shouldFocusError: true, // Focus first error field
    defaultValues: {
      medium: 'gujarati', // Default medium is Gujarati
    },
  });

  const totalMarks = watch('totalMarks');
  const obtainedMarks = watch('obtainedMarks');

  useEffect(() => {
    let mounted = true;
    
    const fetchSettings = async () => {
      try {
        const data = await adminApi.getSettingsPublic();
        if (!mounted) return;
        if (data.lastDateToUploadResult) {
          const displayDate = new Date(data.lastDateToUploadResult);
          const endOfDay = new Date(data.lastDateToUploadResult);
          endOfDay.setHours(23, 59, 59, 999);
          setDeadlineDate(displayDate);
          setIsUploadClosed(new Date() > endOfDay);
        } else {
          setIsUploadClosed(false);
          setDeadlineDate(null);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // If settings fail to load, allow uploads (don't block)
        setIsUploadClosed(false);
        setDeadlineDate(null);
      }
    };
    
    fetchSettings();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Load data immediately, don't wait for settings
    loadData();
  }, []);

  useEffect(() => {
    // Always calculate percentage from marks
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

  const onSubmit = async (data: ResultFormData) => {
    if (!resultImage) {
      showWarning(t('validation.resultImageRequired'));
      setIsLoading(false);
      return;
    }
    
    // Check if upload deadline has passed
    try {
      const settings = await adminApi.getSettingsPublic();
      if (settings.lastDateToUploadResult) {
        const lastDate = new Date(settings.lastDateToUploadResult);
        lastDate.setHours(23, 59, 59, 999); // End of the day
        const now = new Date();
        if (now > lastDate) {
          showError(t('validation.uploadDeadlinePassed'));
          return;
        }
      }
    } catch (error) {
      // If settings check fails, continue with upload (don't block if settings unavailable)
      console.error('Error checking settings:', error);
    }
    
    setIsLoading(true);
    try {
      const resultData: CreateResultData = {
        ...data,
        resultImage: resultImage,
      };
      await resultApi.create(resultData);
      // Navigate to success page with contact number
      navigate('/result-success', { state: { contactNumber: data.contactNumber } });
    } catch (error: any) {
      showError(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResultImage(null);
    setCalculatedPercentage(null);
  };

  const formatDate = React.useMemo(() => {
    const locale = language === 'gu' ? 'gu-IN' : 'en-IN';
    return (date: Date) =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
  }, [language]);

  if (isUploadClosed) {
    return (
      <Layout>
        <div className={styles.uploadClosed}>
          <h1 className={styles.uploadClosedTitle}>{t('pages.upload.closedTitle')}</h1>
          <p className={styles.uploadClosedDescription}>{t('pages.upload.closedDescription')}</p>
          {deadlineDate && (
            <div className={styles.closedDate}>
              {t('pages.upload.closedDateLabel')}: {formatDate(deadlineDate)}
            </div>
          )}
          <Button variant="primary" size="large" onClick={() => navigate('/')}>
            {t('pages.upload.closedButton')}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.uploadPage}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t('pages.upload.title')}</h1>
          <p className={styles.subtitle}>{t('pages.upload.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label={<>{t('forms.studentName')} <span className={styles.requiredAsterisk}>*</span></>}
            {...register('studentName')}
            error={errors.studentName?.message}
          />

          <Select
            label={<>{t('forms.standard')} <span className={styles.requiredAsterisk}>*</span></>}
            options={standards.map((s) => ({
              value: s._id,
              label: s.standardName,
            }))}
            {...register('standardId')}
            error={errors.standardId?.message}
          />

          <div className={styles.radioGroup}>
            <label>{t('forms.medium')} <span className={styles.requiredAsterisk}>*</span></label>
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

          <div className={styles.marksSection}>
            <Input
              label={<>{t('forms.totalMarks')} <span className={styles.requiredAsterisk}>*</span></>}
              type="number"
              step="1"
              {...register('totalMarks', { 
                valueAsNumber: true,
                required: 'Total marks is required',
              })}
              error={errors.totalMarks?.message}
            />
            <Input
              label={<>{t('forms.obtainedMarks')} <span className={styles.requiredAsterisk}>*</span></>}
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
            label={<>{t('forms.village')} <span className={styles.requiredAsterisk}>*</span></>}
            options={villages.map((v) => ({
              value: v._id,
              label: v.villageName,
            }))}
            {...register('villageId')}
            error={errors.villageId?.message}
          />

          <Input
            label={<>{t('forms.contactNumber')} <span className={styles.requiredAsterisk}>*</span></>}
            type="tel"
            maxLength={10}
            {...register('contactNumber')}
            error={errors.contactNumber?.message}
          />

          <FileUpload
            label={<>{t('forms.resultImage')} <span className={styles.requiredAsterisk}>*</span></>}
            onChange={setResultImage}
            value={resultImage}
            error={!resultImage ? t('validation.resultImageRequired') : undefined}
          />

          <div className={styles.actions}>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {t('common.save')}
            </Button>
            <Button type="button" variant="danger" onClick={handleReset}>
              {t('common.reset')}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UploadResultPage;

