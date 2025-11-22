import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { resultApi } from '../../services/api/resultApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Result, Village, Standard, CreateResultData } from '../../types/result.types';
import { getImageUrl } from '../../utils/apiConfig';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import Select from '../../components/common/Select/Select';
import ImageModal from '../../components/common/ImageModal/ImageModal';
import EditResultModal from '../../components/common/EditResultModal/EditResultModal';
import styles from './ManageResults.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { reportApi } from '../../services/api/reportApi';

const ManageResults: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [results, setResults] = useState<Result[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gujarati' | 'english' | 'college'>('gujarati');
  const [filters, setFilters] = useState({
    standardId: '',
    villageId: '',
  });
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [fullImageUrl2, setFullImageUrl2] = useState<string | null>(null);
  const [autoOpenedResultId, setAutoOpenedResultId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadResults();
  }, [activeTab, filters]);


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
      let filtersToApply: any = {
        limit: 10000, // Get all results without pagination
      };
      
      // For college tab, don't filter by medium, we'll filter by isCollegeLevel
      if (activeTab === 'college') {
        // Get all results, we'll filter by college level on frontend
        filtersToApply = {
          limit: 10000,
        };
      } else {
        // For gujarati and english tabs, filter by medium
        filtersToApply.medium = activeTab;
      }
      
      if (filters.standardId) filtersToApply.standardId = filters.standardId;
      if (filters.villageId) filtersToApply.villageId = filters.villageId;
      
      const response = await resultApi.getAll(filtersToApply);
      let filteredResults = response.data;
      
      // Filter by college level based on active tab
      if (activeTab === 'college') {
        // Only show college level results
        filteredResults = filteredResults.filter((result: Result) => {
          const standard = typeof result.standardId === 'object' ? result.standardId : null;
          return standard?.isCollegeLevel === true;
        });
      } else {
        // For gujarati and english tabs, exclude college level results
        filteredResults = filteredResults.filter((result: Result) => {
          const standard = typeof result.standardId === 'object' ? result.standardId : null;
          return standard?.isCollegeLevel !== true;
        });
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (result: Result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
    setFullImageUrl(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultId = params.get('resultId');

    if (resultId && autoOpenedResultId !== resultId) {
      // Fetch the result directly by ID to ensure we have it regardless of current filters
      const fetchAndOpenResult = async () => {
        try {
          const targetResult = await resultApi.getById(resultId);
          
          // Determine which tab the result should be in
          const standard = typeof targetResult.standardId === 'object' ? targetResult.standardId : null;
          const shouldBeInCollegeTab = standard?.isCollegeLevel === true;
          const correctTab = shouldBeInCollegeTab ? 'college' : (targetResult.medium as 'gujarati' | 'english');
          
          // Set the active tab to match the result's category if needed
          if (activeTab !== correctTab) {
            setActiveTab(correctTab);
          }
          
          // Open the edit modal immediately with the fetched result
          // We don't need to wait for it to appear in filtered results
          handleEdit(targetResult);
          setAutoOpenedResultId(resultId);

          // Clean up the URL
          params.delete('resultId');
          const newSearch = params.toString();
          navigate(
            newSearch ? `${location.pathname}?${newSearch}` : location.pathname,
            { replace: true }
          );
        } catch (error) {
          console.error('Error fetching result:', error);
          showError('Failed to load result');
        }
      };

      fetchAndOpenResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, autoOpenedResultId]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    setFullImageUrl(null);
    setFullImageUrl2(null);
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

  const handleImageClick = (result: Result) => {
    setFullImageUrl(result.resultImageUrl ? getResultImageUrl(result) : null);
    setFullImageUrl2(result.resultImage2Url ? getResultImage2Url(result)! : null);
  };

  const getStandardName = (result: Result) => {
    if (result.otherStandardName) {
      return result.otherStandardName;
    }
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

  // Use the shared getImageUrl utility function
  const getResultImageUrl = (result: Result) => getImageUrl(result.resultImageUrl);
  const getResultImage2Url = (result: Result) => result.resultImage2Url ? getImageUrl(result.resultImage2Url) : null;

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

  const handleDownloadPdf = async () => {
    try {
      const filtersToApply: any = {};
      
      // For college tab, don't filter by medium
      if (activeTab !== 'college') {
        filtersToApply.medium = activeTab;
      }
      
      if (filters.standardId) filtersToApply.standardId = filters.standardId;
      if (filters.villageId) filtersToApply.villageId = filters.villageId;
      
      const blob = await reportApi.exportManageResultsPdf(filtersToApply);
      saveAs(blob, 'results.pdf');
    } catch (error) {
      showError(t('messages.error.serverError'));
    }
  };

  const handleDownloadCollegeListByVillage = async () => {
    try {
      const blob = await reportApi.exportCollegeListByVillage(activeTab);
      saveAs(blob, 'college-list-by-village.pdf');
    } catch (error) {
      showError(t('messages.error.serverError'));
    }
  };

  const handleDownloadSchoolListByVillage = async () => {
    try {
      const blob = await reportApi.exportSchoolListByVillage();
      saveAs(blob, 'school-list-by-village.pdf');
    } catch (error) {
      showError(t('messages.error.serverError'));
    }
  };

  const handlePrintCollege = async () => {
    try {
      const blob = await reportApi.exportPrintCollege();
      saveAs(blob, 'print-college.pdf');
    } catch (error) {
      showError(t('messages.error.serverError'));
    }
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
            <button
              className={activeTab === 'college' ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab('college')}
            >
              {t('pages.results.college')}
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

            <Button
              variant="primary"
              onClick={handleDownloadPdf}
            >
              {t('common.download')} PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadCollegeListByVillage}
            >
              {t('pages.results.collegeList')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadSchoolListByVillage}
            >
              {t('pages.results.schoolListByVillage')}
            </Button>
            <Button
              variant="secondary"
              onClick={handlePrintCollege}
            >
              {t('pages.results.printCollege')}
            </Button>
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
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {result.resultImageUrl && (
                            <img
                              src={getResultImageUrl(result)}
                              alt="Result 1"
                              className={styles.resultThumbnail}
                              onClick={() => handleImageClick(result)}
                              title="Result Image 1"
                            />
                          )}
                          {result.resultImage2Url && (
                            <img
                              src={getResultImage2Url(result)!}
                              alt="Result 2"
                              className={styles.resultThumbnail}
                              onClick={() => handleImageClick(result)}
                              title="Result Image 2"
                            />
                          )}
                        </div>
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
          <EditResultModal
            result={selectedResult}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={() => {
              loadResults();
            }}
            showNavigation={sortedResults.length > 1}
            currentIndex={getCurrentResultIndex()}
            totalCount={sortedResults.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canNavigatePrevious={canNavigatePrevious}
            canNavigateNext={canNavigateNext}
          />
        )}

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
      </div>
    </Layout>
  );
};

export default ManageResults;

