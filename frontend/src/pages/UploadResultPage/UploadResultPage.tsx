import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '../../i18n/useTranslation';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Village, Standard, CreateResultData } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import FileUpload from '../../components/common/FileUpload/FileUpload';
import Button from '../../components/common/Button/Button';
import styles from './UploadResultPage.module.css';

const resultSchema = z.object({
  studentName: z.string().min(2, 'Minimum 2 characters required').max(100),
  standardId: z.string().min(1, 'Standard is required'),
  medium: z.enum(['gujarati', 'english']),
  totalMarks: z.number().min(1).max(10000).optional(),
  obtainedMarks: z.number().min(0).optional(),
  percentage: z.number().min(0).max(100),
  villageId: z.string().min(1, 'Village is required'),
  contactNumber: z.string().regex(/^[0-9]{10}$/).optional().or(z.literal('')),
}).refine(
  (data) => {
    // Either marks or percentage must be provided
    if (data.totalMarks && data.obtainedMarks) {
      return data.obtainedMarks <= data.totalMarks;
    }
    return true;
  },
  {
    message: 'Obtained marks cannot exceed total marks',
    path: ['obtainedMarks'],
  }
);

type ResultFormData = z.infer<typeof resultSchema>;

const UploadResultPage: React.FC = () => {
  const { t } = useTranslation();
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  });

  const totalMarks = watch('totalMarks');
  const obtainedMarks = watch('obtainedMarks');
  const percentage = watch('percentage');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (totalMarks && obtainedMarks) {
      const calc = (obtainedMarks / totalMarks) * 100;
      setCalculatedPercentage(calc);
      setValue('percentage', parseFloat(calc.toFixed(2)));
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
    setIsLoading(true);
    try {
      const resultData: CreateResultData = {
        ...data,
        resultImage: resultImage || undefined,
      };
      await resultApi.create(resultData);
      alert(t('messages.success.resultAdded'));
      reset();
      setResultImage(null);
      setCalculatedPercentage(null);
    } catch (error: any) {
      alert(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResultImage(null);
    setCalculatedPercentage(null);
  };

  return (
    <Layout>
      <div className={styles.uploadPage}>
        <h1 className={styles.title}>{t('pages.upload.title')}</h1>
        <p className={styles.subtitle}>{t('pages.upload.subtitle')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label={t('forms.studentName')}
            {...register('studentName')}
            error={errors.studentName?.message}
          />

          <div className={styles.radioGroup}>
            <label>{t('forms.medium')}</label>
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
            label={t('forms.standard')}
            options={standards.map((s) => ({
              value: s._id,
              label: s.standardName,
            }))}
            {...register('standardId')}
            error={errors.standardId?.message}
          />

          <div className={styles.marksSection}>
            <Input
              label={t('forms.totalMarks')}
              type="number"
              step="1"
              {...register('totalMarks', { valueAsNumber: true })}
              error={errors.totalMarks?.message}
            />
            <Input
              label={t('forms.obtainedMarks')}
              type="number"
              step="0.01"
              {...register('obtainedMarks', { valueAsNumber: true })}
              error={errors.obtainedMarks?.message}
            />
          </div>

          <Input
            label={t('forms.percentage')}
            type="number"
            step="0.01"
            {...register('percentage', { valueAsNumber: true })}
            error={errors.percentage?.message}
            readOnly={calculatedPercentage !== null}
          />
          {calculatedPercentage !== null && (
            <p className={styles.calculatedNote}>
              Calculated: {calculatedPercentage.toFixed(2)}%
            </p>
          )}

          <Select
            label={t('forms.village')}
            options={villages.map((v) => ({
              value: v._id,
              label: v.villageName,
            }))}
            {...register('villageId')}
            error={errors.villageId?.message}
          />

          <Input
            label={t('forms.contactNumber')}
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

