import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { adminApi, Settings } from '../../services/api/adminApi';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [, setSettings] = useState<Settings | null>(null);
  const [lastDateToUploadResult, setLastDateToUploadResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
      if (data.lastDateToUploadResult) {
        // Format date for input (YYYY-MM-DD)
        const date = new Date(data.lastDateToUploadResult);
        const formattedDate = date.toISOString().split('T')[0];
        setLastDateToUploadResult(formattedDate);
      }
    } catch (error) {
      showError(t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = await adminApi.updateSettings({
        lastDateToUploadResult: lastDateToUploadResult || null,
      });
      setSettings(updatedSettings);
      showSuccess(t('pages.admin.settings.saveSuccess'));
    } catch (error) {
      showError(t('messages.error.serverError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loading}>{t('common.loading')}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.settingsPage}>
        <h1 className={styles.title}>{t('pages.admin.settings.title')}</h1>

        <div className={styles.settingsForm}>
          <div className={styles.formGroup}>
            <Input
              label={t('pages.admin.settings.lastDateToUploadResult')}
              type="date"
              value={lastDateToUploadResult}
              onChange={(e) => setLastDateToUploadResult(e.target.value)}
            />
            <p className={styles.helpText}>
              {t('pages.admin.settings.lastDateToUploadResultHelp')}
            </p>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;

