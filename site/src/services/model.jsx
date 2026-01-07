function FormUpload() {
    const [file, setFile] = React.useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Escolha um arquivo!");
        try {
            const result = await uploadFile("http://localhost:3000/upload", file);
            console.log("Upload realizado:", result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar</button>
        </div>
    );
}
