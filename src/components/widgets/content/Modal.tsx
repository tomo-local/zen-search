import type { ReactNode } from "react";
import { useId } from "react";

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
}> = ({ onClose, className, children }) => {
  const overlayId = useId();
  return (
    <button
      aria-label="Close modal overlay"
      tabIndex={0}
      type="button"
      style={{ all: "unset", cursor: "pointer" }}
      id={`modal-overlay-${overlayId}`}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      onClick={onClose}
    >
      {children}
    </button>
  );
};

const ModalContainer: React.FC<{
  className?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ className, children, onClick }) => {
  const containerId = useId();

  return (
    <button
      type="button"
      id={`zen-search-modal-container-${containerId}`}
      className={`relative ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
};

const ModalCloseButton: React.FC<{
  onClose: (event: React.MouseEvent) => void;
  className?: string;
}> = ({ onClose, className }) => {
  const containerId = useId();

  return (
    <button
      type="button"
      id={`zen-search-modal-close-button-${containerId}`}
      className={`absolute top-2 right-2 ${className}`}
      onClick={onClose}
    >
      &times;
    </button>
  );
};

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
