import React from 'react';
import Modal from 'react-modal';

const ModalProfesor = ({ isOpen, onRequestClose, professor, onAccept, onReject }) => {
    const handleAccept = () => {
        onAccept(professor.id);
        onRequestClose();
    };

    const handleReject = () => {
        onReject(professor.id);
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
            <h2>Detalles del Profesor</h2>
            {professor && (
                <div>
                    <p><strong>Nombre:</strong> {professor.name}</p>
                    <p><strong>Email:</strong> {professor.email}</p>
                    <p><strong>Estado de la cuenta:</strong> {professor.status}</p>
                </div>
            )}
            <div>
                <button onClick={handleAccept}>Aceptar</button>
                <button onClick={handleReject}>Rechazar</button>
            </div>
        </Modal>
    );
};

export default ModalProfesor;