import { FaFileExcel, FaFilePdf, FaMagnifyingGlass, FaPlus, FaEye } from "react-icons/fa6";
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import style from './Signals.module.css';
import { MdDelete, MdEdit, MdPreview } from "react-icons/md";
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

  const filtered = sinais.filter(s =>
    s.palavra_portugues.toLowerCase().includes(search.toLowerCase())
  );
  const [file, setFile] = useState(null);
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
      let payload = { ...data };

      const handleFileField = async (fieldKey) => {
        const fileInput = data[fieldKey];
        // Caso 1: Novo arquivo selecionado (FileList com File)
        if (fileInput && fileInput.length > 0 && fileInput[0] instanceof File) {
          return signalService.upload(fileInput[0]).then(res => {
            if (res && res.sucesso) return res.path;
            return null;
          });
        }
        // Caso 2: String existente (não modificada)
        if (typeof fileInput === 'string' && fileInput.length > 0) {
          return fileInput;
        }
        // Caso 3: Campo vazio/inválido.
        // Se estamos editando, tentamos manter o valor antigo se o usuário não tocou no input (fileInput vazia)
        // Mas se o usuário limpou... (input file não deixa limpar fácil sem ser reset)
        if (selectedSignal && selectedSignal[fieldKey]) {
          return selectedSignal[fieldKey];
        }
        return null; // Ou string vazia ""
      };

      setUploadStatus("Processando uploads...");

      const videoPath = await handleFileField('video_url');
      if (videoPath) payload.video_url = videoPath;
      else if (selectedSignal?.video_url) payload.video_url = selectedSignal.video_url; // Fallback extra

      const thumbPath = await handleFileField('thumb_url');
      if (thumbPath) payload.thumb_url = thumbPath;
      else if (selectedSignal?.thumb_url) payload.thumb_url = selectedSignal.thumb_url;

      const modelPath = await handleFileField('url_modelo_3d');
      if (modelPath) payload.url_modelo_3d = modelPath;
      else if (selectedSignal?.url_modelo_3d) payload.url_modelo_3d = selectedSignal.url_modelo_3d;

      // Se houver url_animacao no futuro, adicionar aqui.
      // Por enquanto, o backend aceita, mas o form não tem. Vamos manter null se não tiver.

      let response;
      if (showEdit && selectedSignal) {
        response = await signalService.update(selectedSignal.id_sinal, payload);
      } else {
        response = await signalService.create(payload);
      }

      if (response && response.sucesso) {
        alert("Operação realizada com sucesso!");
        setShowAdd(false);
        setShowEdit(false);
        setFile(null);
        reset();
        loadSignals();
      } else {
        alert("Erro ao salvar: " + (response?.erro || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro no submit:", error);
      alert("Erro de conexão.");
    } finally {
      setUploadStatus("");
    }
  }

  return (
    <>

      <NavBarAdmin />
      <main className={style.containerSignals}>
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
          <button className={style.btnFaFileExcel}>
            <FaFileExcel />
            <span>Excel</span>
          </button>
          <button className={style.btnFaFilePdf}>
            <FaFilePdf />
            <span>PDF</span>
          </button>
          <button
            className={style.btnFaPlus}
            onClick={() => setShowAdd(true)}
          >
            <FaPlus />
            <span>Adicionar</span>
          </button>
        </div>
        <div className={style.listSignals}>
          {filtered.length > 0 ? filtered.map((item) => (
            <div className={style.Signal} key={item.id_sinal}>
              <div className={style.infoSignal}>
                <div className={style.video}>
                  {item.video_url ? (
                    <video src={item.video_url.startsWith('http') ? item.video_url : `${baseURL}${item.video_url}`} controls width="100%" />
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
                <span title="Editar" onClick={() => toggleEdit(item)}><MdEdit size={30} /></span>
                <span title="Deletar" onClick={() => DeletarSignal(item.id_sinal)}><MdDelete size={30} /></span>
                <span title="Visualizar" onClick={() => toggleView(item)}><FaEye size={30} /></span>
              </div>
            </div>
          )) : (
            <div className={style.noData}>Nenhum sinal encontrado.</div>
          )}
        </div>
      </main>
      {
        showView && (
          <div className={style.ContainerViewSignal} onClick={(e) => {
            if (style.ContainerViewSignal == e.target.className) {
              setShowView((prev) => prev = !prev)
            }
          }}>
            <div className={style.cardViewSignal}>
              <div className={style.CardVideo}>
                {
                  !toggleVideoToAvatar ? (
                    selectedSignal?.video_url ? (
                      <video src={selectedSignal.video_url.startsWith('http') ? selectedSignal.video_url : `${baseURL}${selectedSignal.video_url}`} controls width="100%" />
                    ) : <span>Sem vídeo</span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee' }}>
                      {selectedSignal?.thumb_url ? (
                        <img
                          src={selectedSignal.thumb_url.startsWith('http') ? selectedSignal.thumb_url : `${baseURL}${selectedSignal.thumb_url}`}
                          alt="Avatar"
                          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        />
                      ) : <span style={{ padding: 20 }}>Sem Imagem de Capa</span>}

                      {selectedSignal?.url_modelo_3d ? (
                        <div style={{ marginTop: 10 }}>
                          <a href={selectedSignal.url_modelo_3d.startsWith('http') ? selectedSignal.url_modelo_3d : `${baseURL}${selectedSignal.url_modelo_3d}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                            Baixar/Visualizar Modelo 3D
                          </a>
                        </div>
                      ) : <span style={{ marginTop: 10, fontSize: '0.8em' }}>Sem arquivo 3D</span>}
                    </div>
                  )
                }
              </div>
              <div className={style.CardMeaning}>
                <h3>Palavra</h3>
                <span>Categoria</span>
                {
                  toggleVideoToAvatar ? (
                    <span onClick={() => settoggleVideoToAvatar((prev) => prev = !prev)}>Video</span>
                  ) : (
                    <span onClick={() => settoggleVideoToAvatar((prev) => prev = !prev)}>Avatar 3D</span>
                  )
                }
              </div>
              <div className={style.CardContext}>
                <h3>Contexto</h3>
                <hr />
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident repellendus expedita numquam laborum ad! Sed inventore quibusdam velit provident sint tempore, praesentium consequuntur alias cum facere magni ratione veritatis qui.
                </p>
              </div>

            </div>
          </div>
        )
      }
      {
        showEdit && (
          <div className={style.modalAdd}>
            <div className={style.cardAdd}>
              <h3>Actualizar Sinal</h3>
              <form onSubmit={handleSubmit(SubmitSignal)}>
                <label>
                  Palavra em Português (Angolano)
                  <input type="text" {...register("palavra_portugues", {
                    required: "Este campo é obrigatorio"
                  })} />
                </label>
                <label>
                  Descrição do gesto
                  <textarea name="" id="" {...register("descricao_gesto", {
                    required: "Este campo é Obrigatorio"
                  })}></textarea>
                </label>
                <label>
                  Categoria do Sinal
                  <select {...register("id_categoria", { required: "Este campo é Obrigatorio" })}>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.categoria}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Animação 3D
                  <input type="file" {...register("url_modelo_3d")} accept=".glb,.gltf,video/*" />
                </label>
                <label>
                  Video Sinal
                  <input type="file" {...register("video_url")} accept="video/*" />
                </label>
                <label>
                  Fonte / Origem
                  <input type="text" {...register("fonte")} placeholder="Ex: Youtube, Livro X..." />
                </label>
                <label>
                  Tags (separadas por vírgula)
                  <input type="text" {...register("tags")} placeholder="Ex: cumprimento, verbo, saudações" />
                </label>
                <label>
                  Imagem de Apresentação
                  <input
                    type="file" accept="image/*"
                    {...register("thumb_url")}
                  />
                </label>

                <div className={style.actions}>
                  <button type="button" onClick={toggleEdit}>
                    Cancelar
                  </button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {showAdd && (
        <div className={style.modalAdd}>
          <div className={style.cardAdd}>
            <h3>Novo Sinal</h3>
            <form onSubmit={handleSubmit(SubmitSignal)}>
              <label>
                Palavra em Português (Angolano)
                <input type="text" {...register("palavra_portugues", {
                  required: "Este campo é obrigatorio"
                })} />
              </label>
              <label>
                Descrição do gesto
                <textarea name="" id="" {...register("descricao_gesto", {
                  required: "Este campo é Obrigatorio"
                })}></textarea>
              </label>
              <label>
                Categoria do Sinal
                <select {...register("id_categoria", { required: "Este campo é Obrigatorio" })}>
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Animação 3D
                <input type="file" {...register("url_modelo_3d")} accept=".glb,.gltf,video/*" />
              </label>
              <label>
                Video Sinal
                <input type="file" {...register("video_url")} accept="video/*" />
              </label>
              <label>
                Imagem de Apresentação
                <input
                  type="file" accept="image/*"
                  {...register("thumb_url")}
                />
              </label>

              <div className={style.actions}>
                <button type="button" onClick={() => setShowAdd(false)}>
                  Cancelar
                </button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
