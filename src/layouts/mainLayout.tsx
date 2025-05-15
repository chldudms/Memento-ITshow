import React from 'react';
import Header from '../components/header';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
        </>
    );
};
export default MainLayout;
