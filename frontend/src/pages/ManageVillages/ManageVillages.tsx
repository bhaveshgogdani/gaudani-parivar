import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { villageApi } from '../../services/api/villageApi';
import { Village } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './ManageVillages.module.css';

const ManageVillages: React.FC = () => {
  const { t } = useTranslation();
  const [villages, setVillages] = useState<Village[]>([]);
  const [formData, setFormData] = useState({ villageName: '', isActive: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const data = await villageApi.getAll(true);
      setVillages(data);
    } catch (error) {
      console.error('Error loading villages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await villageApi.update(editingId, formData);
        alert(t('messages.success.villageUpdated'));
      } else {
        await villageApi.create(formData);
        alert(t('messages.success.villageAdded'));
      }
      setFormData({ villageName: '', isActive: true });
      setEditingId(null);
      loadVillages();
    } catch (error: any) {
      alert(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (village: Village) => {
    setFormData({ villageName: village.villageName, isActive: village.isActive });
    setEditingId(village._id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this village?')) {
      try {
        await villageApi.delete(id);
        alert(t('messages.success.villageDeleted'));
        loadVillages();
      } catch (error) {
        alert('Error deleting village');
      }
    }
  };

  return (
    <Layout>
      <div className={styles.manageVillages}>
        <h1 className={styles.title}>{t('navigation.manageVillages')}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('forms.villageName')}
            value={formData.villageName}
            onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
            required
          />

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            {t('forms.isActive')}
          </label>

          <div className={styles.actions}>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {t('common.save')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setFormData({ villageName: '', isActive: true });
                setEditingId(null);
              }}
            >
              {t('common.reset')}
            </Button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('forms.villageName')}</th>
                <th>{t('forms.isActive')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((village) => (
                <tr key={village._id}>
                  <td>{village.villageName}</td>
                  <td>{village.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleEdit(village)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(village._id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageVillages;

