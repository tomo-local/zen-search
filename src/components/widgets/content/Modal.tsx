import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
  containerClassName?: string;
  closeButtonClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const ModalOverlay: React.FC<{
  onClose: (event: React.MouseEvent) => void;
  className?: string;
  children: ReactNode;
}> = ({ onClose, className, children }) => (
  <div
    id="modal-overlay"
    className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    onClick={onClose}
  >
    {children}
  </div>
);

const ModalContainer: React.FC<{
  className?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ className, children, onClick }) => (
  <div
    id="zen-search-modal-container"
    className={`relative ${className}`}
    onClick={(e) => {
      e.stopPropagation();
      onClick && onClick(e);
    }}
  >
    {children}
  </div>
);

const ModalCloseButton: React.FC<{
  onClose: (event: React.MouseEvent) => void;
  className?: string;
}> = ({ onClose, className }) => (
  <button
    id="zen-search-modal-close-button"
    className={`absolute top-2 right-2 ${className}`}
    onClick={onClose}
  >
    &times;
  </button>
);

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  overlayClassName,
  containerClassName,
  closeButtonClassName,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={onClose} className={overlayClassName}>
      <ModalContainer
        className={containerClassName}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClose={onClose} className={closeButtonClassName} />
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

export { ModalOverlay, ModalContainer, ModalCloseButton };
