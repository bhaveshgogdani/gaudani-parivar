import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { standardApi } from '../../services/api/standardApi';
import { Standard } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './ManageStandards.module.css';

const ManageStandards: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [formData, setFormData] = useState({
    standardName: '',
    standardCode: '',
    displayOrder: 0,
    isCollegeLevel: false,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      const data = await standardApi.getAll(true);
      setStandards(data);
    } catch (error) {
      console.error('Error loading standards:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await standardApi.update(editingId, formData);
        showSuccess(t('messages.success.standardUpdated'));
      } else {
        await standardApi.create(formData);
        showSuccess(t('messages.success.standardAdded'));
      }
      handleCloseModal();
      loadStandards();
    } catch (error: any) {
      showError(error.response?.data?.message || t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (standard: Standard) => {
    setFormData({
      standardName: standard.standardName,
      standardCode: standard.standardCode,
      displayOrder: standard.displayOrder,
      isCollegeLevel: standard.isCollegeLevel,
      isActive: standard.isActive,
    });
    setEditingId(standard._id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      standardName: '',
      standardCode: '',
      displayOrder: 0,
      isCollegeLevel: false,
      isActive: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      standardName: '',
      standardCode: '',
      displayOrder: 0,
      isCollegeLevel: false,
      isActive: true,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this standard?')) {
      try {
        await standardApi.delete(id);
        showSuccess(t('messages.success.standardDeleted'));
        loadStandards();
      } catch (error) {
        showError('Error deleting standard');
      }
    }
  };

  return (
    <Layout>
      <div className={styles.manageStandards}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{t('navigation.manageStandards')}</h1>
          <Button variant="primary" onClick={handleAddNew}>
            Add {t('navigation.manageStandards')}
          </Button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('forms.standardName')}</th>
                <th>{t('forms.standardCode')}</th>
                <th>{t('forms.displayOrder')}</th>
                <th>{t('forms.isCollegeLevel')}</th>
                <th>{t('forms.isActive')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {standards.map((standard) => (
                <tr key={standard._id}>
                  <td>{standard.standardName}</td>
                  <td>{standard.standardCode}</td>
                  <td>{standard.displayOrder}</td>
                  <td>{standard.isCollegeLevel ? 'Yes' : 'No'}</td>
                  <td>{standard.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleEdit(standard)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(standard._id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingId ? t('common.edit') : 'Add'} {t('navigation.manageStandards')}</h2>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label={t('forms.standardName')}
                  value={formData.standardName}
                  onChange={(e) => setFormData({ ...formData, standardName: e.target.value })}
                  required
                />

                <Input
                  label={t('forms.standardCode')}
                  value={formData.standardCode}
                  onChange={(e) => setFormData({ ...formData, standardCode: e.target.value })}
                  required
                />

                <Input
                  label={t('forms.displayOrder')}
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  required
                />

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isCollegeLevel}
                    onChange={(e) => setFormData({ ...formData, isCollegeLevel: e.target.checked })}
                  />
                  {t('forms.isCollegeLevel')}
                </label>

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
                  <Button type="button" variant="danger" onClick={handleCloseModal}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageStandards;

