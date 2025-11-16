import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Result, Village, Standard } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Select from '../../components/common/Select/Select';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import ImageModal from '../../components/common/ImageModal/ImageModal';
import styles from './ViewResultsPage.module.css';

const ViewResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Result[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [filters, setFilters] = useState({
    standardId: '',
    villageId: '',
    medium: '',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isAdmin = localStorage.getItem('adminToken');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadResults();
  }, [filters]);

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
      const response = await resultApi.getAll({
        standardId: filters.standardId || undefined,
        villageId: filters.villageId || undefined,
        medium: filters.medium as 'gujarati' | 'english' | undefined,
        search: filters.search || undefined,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintCollege = () => {
    const collegeResults = results.filter(
      (r) => typeof r.standardId === 'object' && r.standardId?.isCollegeLevel
    );
    // Create a new window with college results for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>College Results</title></head>
          <body>
            <h1>College Results</h1>
            <table border="1">
              <tr>
                <th>Sr. No.</th>
                <th>Student Name</th>
                <th>Standard</th>
                <th>Percentage</th>
                <th>Village</th>
                <th>Contact</th>
              </tr>
              ${collegeResults.map(
                (r, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${r.studentName}</td>
                  <td>${typeof r.standardId === 'object' ? r.standardId.standardName : ''}</td>
                  <td>${r.percentage}%</td>
                  <td>${typeof r.villageId === 'object' ? r.villageId.villageName : ''}</td>
                  <td>${r.contactNumber || ''}</td>
                </tr>
              `
              ).join('')}
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await resultApi.delete(id);
        loadResults();
      } catch (error) {
        alert('Error deleting result');
      }
    }
  };

  return (
    <Layout>
      <div className={styles.resultsPage}>
        <h1 className={styles.title}>{t('pages.results.title')}</h1>

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
            onChange={(e) => handleFilterChange('standardId', e.target.value)}
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
            onChange={(e) => handleFilterChange('villageId', e.target.value)}
          />

          <Select
            label={t('pages.results.filterByMedium')}
            options={[
              { value: '', label: t('pages.results.all') },
              { value: 'gujarati', label: t('forms.gujarati') },
              { value: 'english', label: t('forms.english') },
            ]}
            value={filters.medium}
            onChange={(e) => handleFilterChange('medium', e.target.value)}
          />

          <Input
            label={t('common.search')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder={t('common.search')}
          />

          <div className={styles.filterActions}>
            <Button variant="primary" onClick={loadResults}>
              {t('common.search')}
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              {t('common.print')}
            </Button>
            <Button variant="danger" onClick={handlePrintCollege}>
              {t('pages.results.printCollege')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{t('common.loading')}</div>
        ) : results.length === 0 ? (
          <div className={styles.noResults}>{t('pages.results.noResults')}</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('pages.results.srNo')}</th>
                  <th>{t('pages.results.studentName')}</th>
                  <th>{t('pages.results.standard')}</th>
                  <th>{t('pages.results.percentage')}</th>
                  <th>{t('pages.results.village')}</th>
                  <th>{t('pages.results.contact')}</th>
                  {isAdmin && <th>{t('common.actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result._id}>
                    <td>{index + 1}</td>
                    <td>{result.studentName}</td>
                    <td>
                      {typeof result.standardId === 'object'
                        ? result.standardId.standardName
                        : ''}
                    </td>
                    <td>{result.percentage.toFixed(2)}%</td>
                    <td>
                      {typeof result.villageId === 'object'
                        ? result.villageId.villageName
                        : ''}
                    </td>
                    <td>{result.contactNumber || '-'}</td>
                    {isAdmin && (
                      <td>
                        {result.resultImageUrl && (
                          <Button
                            variant="success"
                            size="small"
                            onClick={() => setSelectedImage(result.resultImageUrl || null)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            {t('common.view')}
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(result._id)}
                        >
                          {t('common.delete')}
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
            alt="Result Image"
          />
        )}
      </div>
    </Layout>
  );
};

export default ViewResultsPage;

