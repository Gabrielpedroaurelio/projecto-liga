import { FaFileExcel, FaFilePdf, FaMagnifyingGlass, FaPlus, FaEye, FaArrowLeft } from "react-icons/fa6";
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import style from './Signals.module.css';
import { MdDelete, MdEdit, MdVideocam, MdPerson } from "react-icons/md";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { signalService, categoryService } from "../../../../services/appServices";
import { GetURL } from "../../../../services/ModelServices";

export default function Signals() {
  const [sinais, setSinais] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = sinais.filter(s =>
    s.palavra_portugues.toLowerCase().includes(search.toLowerCase())
  );
  const [uploadStatus, setUploadStatus] = useState("");
  const [toggleVideoToAvatar, settoggleVideoToAvatar] = useState(false);

  const toggleEdit = (signal = null) => {
    setSelectedSignal(signal);
    if (signal) {
      reset({
        palavra_portugues: signal.palavra_portugues,
        descricao_gesto: signal.descricao_gesto,
        id_categoria: signal.id_categoria,
        video_url: signal.video_url,
        thumb_url: signal.thumb_url,
        url_modelo_3d: signal.url_modelo_3d,
        fonte: signal.fonte,
        tags: Array.isArray(signal.tags) ? signal.tags.join(', ') : signal.tags,
      });
    }
    setShowEdit((prev) => !prev);
  }

  const toggleView = (signal = null) => {
    setSelectedSignal(signal);
    settoggleVideoToAvatar(false);
    setShowView((prev) => !prev);
  }

  const baseURL = GetURL();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      palavra_portugues: "",
      descricao_gesto: "",
      id_categoria: "",
      video_url: "",
      thumb_url: "",
      url_modelo_3d: "",
    }
  });

  useEffect(() => {
    loadSignals();
    loadCategories();
  }, []);

  async function loadSignals() {
    try {
      const res = await signalService.list();
      if (res && res.sucesso) {
        setSinais(res.sinais || []);
      }
    } catch (error) {
      console.error("Erro ao carregar sinais:", error);
    }
  }

  async function loadCategories() {
    try {
      const res = await categoryService.list();
      if (res && res.sucesso) {
        setCategorias(res.categorias || []);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function DeletarSignal(id_sinal) {
    if (confirm("Deseja Eliminar este Item?")) {
      try {
        const res = await signalService.delete(id_sinal);
        if (res && res.sucesso) {
          alert("Sinal deletado!");
          loadSignals();
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  }

  async function SubmitSignal(data) {
    try {
      setIsSubmitting(true);
      let payload = { ...data };

      const handleFileField = async (fieldKey) => {
        const fileInput = data[fieldKey];
        if (fileInput && fileInput.length > 0 && fileInput[0] instanceof File) {
          setUploadStatus(`Fazendo upload de ${fieldKey}...`);
          return signalService.upload(fileInput[0]).then(res => {
            if (res && res.sucesso) return res.path;
            return null;
          });
        }
        if (typeof fileInput === 'string' && fileInput.length > 0) {
          return fileInput;
        }
        if (selectedSignal && selectedSignal[fieldKey]) {
          return selectedSignal[fieldKey];
        }
        return null;
      };

      const videoPath = await handleFileField('video_url');
      if (videoPath) payload.video_url = videoPath;

      const thumbPath = await handleFileField('thumb_url');
      if (thumbPath) payload.thumb_url = thumbPath;

      const modelPath = await handleFileField('url_modelo_3d');
      if (modelPath) payload.url_modelo_3d = modelPath;

      let response;
      if (showEdit && selectedSignal) {
        response = await signalService.update(selectedSignal.id_sinal, payload);
      } else {
        response = await signalService.create(payload);
      }

      if (response && response.sucesso) {
        setShowAdd(false);
        setShowEdit(false);
        reset();
        loadSignals();
      } else {
        alert("Erro ao salvar: " + (response?.erro || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro no submit:", error);
      alert("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  }

  return (
    <>
      <NavBarAdmin />
      <main className={style.containerSignals}>
        <div className={style.headerSection}>
          <div className={style.barsearch}>
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Pesquisar palavra"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={style.controllers}>
            <button className={style.btnFaFileExcel}><FaFileExcel /><span>Excel</span></button>
            <button className={style.btnFaFilePdf}><FaFilePdf /><span>PDF</span></button>
            <button className={style.btnFaPlus} onClick={() => setShowAdd(true)}><FaPlus /><span>Adicionar</span></button>
          </div>
        </div>

        <div className={style.listSignals}>
          {filtered.length > 0 ? filtered.map((item) => (
            <div className={style.Signal} key={item.id_sinal}>
              <div className={style.infoSignal}>
                <div className={style.video}>
                  {item.video_url ? (
                    <video src={item.video_url.startsWith('http') ? item.video_url : `${baseURL}${item.video_url}`} width="100%" muted />
                  ) : (
                    <div className={style.placeholderVideo}>Sem vídeo</div>
                  )}
                </div>
                <div className={style.content}>
                  <span>{item.palavra_portugues}</span>
                  <small className={style.category}>{item.categoria_nome || "Sem categoria"}</small>
                </div>
              </div>
              <div className={style.controllersSignal}>
                <span title="Editar" onClick={() => toggleEdit(item)}><MdEdit size={22} /></span>
                <span title="Deletar" onClick={() => DeletarSignal(item.id_sinal)}><MdDelete size={22} /></span>
                <span title="Visualizar" onClick={() => toggleView(item)}><FaEye size={22} /></span>
              </div>
            </div>
          )) : (
            <div className={style.noData}>Nenhum sinal encontrado.</div>
          )}
        </div>
      </main>

      {showView && (
        <div className={style.ContainerViewSignal} onClick={(e) => {
          if (e.target.className === style.ContainerViewSignal) setShowView(false);
        }}>
          <div className={style.cardViewSignal}>
            <div className={style.viewHeader}>
              <button className={style.btnClose} onClick={() => setShowView(false)}><FaArrowLeft /> Voltar</button>
              <div className={style.toggleButtons}>
                <button
                  className={!toggleVideoToAvatar ? style.activeToggle : ""}
                  onClick={() => settoggleVideoToAvatar(false)}
                >
                  <MdVideocam /> Vídeo
                </button>
                <button
                  className={toggleVideoToAvatar ? style.activeToggle : ""}
                  onClick={() => settoggleVideoToAvatar(true)}
                >
                  <MdPerson /> Avatar 3D
                </button>
              </div>
            </div>

            <div className={style.videoContainer}>
              <div className={style.CardVideo}>
                {!toggleVideoToAvatar ? (
                  selectedSignal?.video_url ? (
                    <video src={selectedSignal.video_url.startsWith('http') ? selectedSignal.video_url : `${baseURL}${selectedSignal.video_url}`} controls width="100%" autoPlay />
                  ) : <div className={style.emptyState}><span>Sem vídeo disponível</span></div>
                ) : (
                  <div className={style.web3dContainer}>
                    {selectedSignal?.url_modelo_3d ? (
                      <model-viewer
                        src={selectedSignal.url_modelo_3d.startsWith('http') ? selectedSignal.url_modelo_3d : `${baseURL}${selectedSignal.url_modelo_3d}`}
                        camera-controls
                        autoplay
                        auto-rotate
                        shadow-intensity="1"
                        style={{ width: '100%', height: '100%' }}
                      ></model-viewer>
                    ) : (
                      <div className={style.emptyState}>
                        <span>Sem avatar 3D disponível</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={style.CardMeaning}>
              <div className={style.mainInfo}>
                <h1>{selectedSignal?.palavra_portugues}</h1>
                <div className={style.metaHeader}>
                  <span className={style.categoryTag}>{selectedSignal?.categoria_nome || "Sem Categoria"}</span>
                  {selectedSignal?.fonte && <span className={style.sourceTag}>Fonte: {selectedSignal.fonte}</span>}
                </div>
              </div>
            </div>
            <div className={style.CardContext}>
              <h3>Contexto / Significado</h3>
              <p>{selectedSignal?.descricao_gesto || "Sem descrição disponível para este sinal."}</p>
            </div>
          </div>
        </div>
      )}

      {(showAdd || showEdit) && (
        <div className={style.modalAdd}>
          <div className={style.cardAdd}>
            <div className={style.modalHeader}>
              <h3>{showEdit ? "Actualizar Sinal" : "Novo Sinal"}</h3>
              {uploadStatus && <span className={style.uploadBadge}>{uploadStatus}</span>}
            </div>
            <form onSubmit={handleSubmit(SubmitSignal)}>
              <div className={style.formGrid}>
                <label>
                  Palavra em Português
                  <input type="text" placeholder="Ex: Bom dia" {...register("palavra_portugues", { required: true })} />
                </label>
                <label>
                  Categoria
                  <select {...register("id_categoria", { required: true })}>
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>{cat.categoria}</option>
                    ))}
                  </select>
                </label>
                <label className={style.fullWidth}>
                  Descrição do gesto
                  <textarea placeholder="Descreva como o gesto é realizado..." {...register("descricao_gesto", { required: true })}></textarea>
                </label>
                <label>
                  Vídeo do Sinal
                  {showEdit && selectedSignal?.video_url && (
                    <div className={style.mediaPreview}>
                      <small>📹 Vídeo atual: {selectedSignal.video_url.split('/').pop()}</small>
                    </div>
                  )}
                  <input type="file" {...register("video_url")} accept="video/*" />
                  <small className={style.helpText}>Deixe em branco para manter o arquivo atual</small>
                </label>
                <label>
                  Modelo 3D (.glb)
                  {showEdit && selectedSignal?.url_modelo_3d && (
                    <div className={style.mediaPreview}>
                      <small>🎨 Modelo atual: {selectedSignal.url_modelo_3d.split('/').pop()}</small>
                    </div>
                  )}
                  <input type="file" {...register("url_modelo_3d")} accept=".glb,.gltf" />
                  <small className={style.helpText}>Deixe em branco para manter o arquivo atual</small>
                </label>
                <label>
                  Imagem de Capa (Thumb)
                  {showEdit && selectedSignal?.thumb_url && (
                    <div className={style.mediaPreview}>
                      <img
                        src={selectedSignal.thumb_url.startsWith('http') ? selectedSignal.thumb_url : `${baseURL}${selectedSignal.thumb_url}`}
                        alt="Preview"
                        className={style.thumbPreview}
                      />
                    </div>
                  )}
                  <input type="file" accept="image/*" {...register("thumb_url")} />
                  <small className={style.helpText}>Deixe em branco para manter a imagem atual</small>
                </label>
                <label>
                  Fonte / Origem
                  <input type="text" placeholder="Ex: MEC, YouTube..." {...register("fonte")} />
                </label>
              </div>

              <div className={style.actions}>
                <button type="button" disabled={isSubmitting} onClick={() => { setShowAdd(false); setShowEdit(false); reset(); }}>
                  Cancelar
                </button>
                <button type="submit" className={style.btnSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : (showEdit ? "Actualizar" : "Cadastrar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
