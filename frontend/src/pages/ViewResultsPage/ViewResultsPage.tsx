import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Result, Village, Standard } from '../../types/result.types';
import { getImageUrl } from '../../utils/apiConfig';
import Layout from '../../components/layout/Layout';
import Select from '../../components/common/Select/Select';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import ImageModal from '../../components/common/ImageModal/ImageModal';
import styles from './ViewResultsPage.module.css';

const ViewResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showError, showWarning } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const hasProcessedStateRef = useRef(false);
  const [results, setResults] = useState<Result[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [filters, setFilters] = useState({
    standardId: '',
    villageId: '',
    medium: '',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isAdmin = localStorage.getItem('adminToken');

  const handleSearchByMobile = async (number?: string) => {
    const searchNumber = number || mobileNumber;
    
    if (!searchNumber || !/^[0-9]{10}$/.test(searchNumber)) {
      showWarning(t('validation.contactNumberRequired'));
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      // Search by contact number - backend now supports searching by contact number
      const response = await resultApi.getAll({
        search: searchNumber,
      });
      
      // Filter results by exact contact number match (backend search might be partial)
      const filteredResults = response.data.filter(
        (result) => result.contactNumber === searchNumber
      );
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching results:', error);
      showError(t('messages.error.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only process location.state once when component mounts
    // This prevents it from persisting after refresh
    if (!hasProcessedStateRef.current && location.state?.contactNumber) {
      const contactNumber = location.state.contactNumber;
      hasProcessedStateRef.current = true;
      
      // Set mobile number and search
      setMobileNumber(contactNumber);
      handleSearchByMobile(contactNumber);
      
      // Clear the location state by replacing it with undefined
      // This prevents the number from persisting after refresh
      navigate(location.pathname, { replace: true, state: undefined });
    }
    
    if (isAdmin) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadResults();
    }
  }, [filters, isAdmin]);

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
    if (confirm(t('messages.confirm.deleteResult'))) {
      try {
        await resultApi.delete(id);
        if (isAdmin) {
          loadResults();
        } else {
          handleSearchByMobile();
        }
      } catch (error) {
        showError(t('messages.error.serverError'));
      }
    }
  };

  // Use the shared getImageUrl utility function
  const getResultImageUrl = (result: Result) => getImageUrl(result.resultImageUrl);

  // Public view - mobile number search
  if (!isAdmin) {
    return (
      <Layout>
        <div className={styles.resultsPage}>
          <div className={styles.searchSection}>
            <div className={styles.searchCard}>
              <h2 className={styles.searchTitle}>{t('pages.viewResults.searchTitle')}</h2>
              <p className={styles.searchSubtitle}>
                {t('pages.viewResults.searchSubtitle')}
              </p>
              <div className={styles.mobileSearch}>
                <Input
                  label={t('pages.viewResults.mobileNumber')}
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t('pages.viewResults.mobileNumberPlaceholder')}
                />
                <Button
                  variant="primary"
                  onClick={() => handleSearchByMobile()}
                  isLoading={isLoading}
                >
                  {t('common.search')}
                </Button>
              </div>
            </div>
          </div>

          {hasSearched && (
            <div className={styles.resultsSection}>
              {isLoading ? (
                <div className={styles.loading}>{t('common.loading')}</div>
              ) : results.length === 0 ? (
                <div className={styles.noResults}>
                  <p>{t('pages.viewResults.noResultsMessage')} <strong>{mobileNumber}</strong></p>
                  <p>{t('pages.viewResults.checkMobileNumber')}</p>
                </div>
              ) : (
                <>
                  <div className={styles.resultsHeader}>
                    <h2>{t('pages.viewResults.yourResults')} ({results.length})</h2>
                    <p>{t('pages.success.mobileNumber')}: <strong>{mobileNumber}</strong></p>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>{t('pages.results.srNo')}</th>
                          <th>{t('pages.results.studentName')}</th>
                          <th>{t('pages.results.standard')}</th>
                          <th>{t('pages.results.percentage')}</th>
                          <th>{t('pages.results.village')}</th>
                          <th>{t('pages.viewResults.resultImage')}</th>
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
                            <td>
                              {result.resultImageUrl && (
                                <Button
                                  variant="success"
                                  size="small"
                                  onClick={() => setSelectedImage(getResultImageUrl(result))}
                                >
                                  {t('common.view')}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
  }

  // Admin view - full filters
  return (
    <Layout showHeader={false}>
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
                      {result.otherStandardName
                        ? result.otherStandardName
                        : typeof result.standardId === 'object'
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
                            onClick={() => {
                              setSelectedImage(getResultImageUrl(result));
                            }}
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
