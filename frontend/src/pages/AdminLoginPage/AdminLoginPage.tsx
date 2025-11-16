import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { adminApi } from '../../services/api/adminApi';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './AdminLoginPage.module.css';

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminApi.login(email, password);
      localStorage.setItem('adminToken', response.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || t('messages.error.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.loginPage}>
        <h1 className={styles.title}>{t('pages.admin.login.title')}</h1>
        <p className={styles.subtitle}>{t('pages.admin.login.subtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('forms.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t('forms.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {t('common.submit')}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setEmail('');
                setPassword('');
              }}
            >
              {t('common.reset')}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLoginPage;

