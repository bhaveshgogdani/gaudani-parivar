import React, { ReactNode } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className={styles.layout}>
      {showHeader && <Header />}
      <main className={styles.main}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;

