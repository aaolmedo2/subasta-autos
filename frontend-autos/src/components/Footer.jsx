import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="text-sm">
                    <span className="font-semibold">Subastas Auto</span> - Tu plataforma de subastas de confianza
                </div>
                <div className="text-sm">
                    &copy; {currentYear} Todos los derechos reservados
                    <br />
                    By. SJA
                </div>

            </div>
        </footer>
    );
};

export default Footer; 