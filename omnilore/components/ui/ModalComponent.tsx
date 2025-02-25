interface ModalComponentProps {
    isOpen: boolean;
    handleClose: () => void;
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
    editMode: boolean;
}

const ModalComponent = ({ isOpen, handleClose, formData, setFormData, editMode }: ModalComponentProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded">
                <h2>{editMode ? 'Edit' : 'Add'} Entry</h2>
                <form>
                    {Object.keys(formData).map((key) => (
                        <input
                            key={key}
                            type="text"
                            value={formData[key] || ''}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            placeholder={key}
                            className="block w-full mb-2 p-2 border"
                        />
                    ))}
                    <button type="button" onClick={handleClose} className="bg-blue-500 p-2 rounded">
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalComponent;