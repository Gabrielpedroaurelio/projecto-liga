import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import style from './Enterprises.module.css'
import { useForm } from 'react-hook-form'
import { useEffect } from "react";
import { MdClose, MdDelete, MdEdit, MdPreview } from "react-icons/md";
import { useState } from "react";
import { FaPlus, FaUsers } from 'react-icons/fa6'
import { HiOutlineMail } from "react-icons/hi";
import { MdPhone } from "react-icons/md";
import { AiFillPhone } from "react-icons/ai";
import logo from '../../../../assets/_images/company/dropbox.png'
import { BsTelephone, BsTelephoneFill } from "react-icons/bs";
import ParagrafoErro from '../../../Elements/ParagrafoErro/ParagrafoErro'
import { enterpriseService } from '../../../../services/appServices';
import { GetURL } from '../../../../services/ModelServices';



export default function Enterprises() {

    const URL = GetURL();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nome_instituicao: "",
            email_instituicao: "",
            telefone: "",
            provincia_instituicao: "",
            municipio_instituicao: "",
            bairro_instituicao: "",
        }
    });

    const [showView, setShowView] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
    const [file, setFile] = useState(null);
    const [empresas, setEmpresas] = useState([]);


    const [search, setSearch] = useState("");

    const filtered = empresas.filter(emp =>
        emp.nome_instituicao?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email_instituicao?.toLowerCase().includes(search.toLowerCase())
    );

    const HighlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <mark key={i} className={style.highlight}>{part}</mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };


    useEffect(() => {
        loadEnterprises();
    }, []);

    async function loadEnterprises() {
        try {
            const res = await enterpriseService.list();
            if (res && res.sucesso) {
                setEmpresas(res.instituicoes || []);
            }
        } catch (error) {
            console.error("Erro ao carregar empresas:", error);
        }
    }

    const toggleView = (empresa = null) => {
        setEmpresaSelecionada(empresa);
        setShowView((prev) => !prev);
    }
    const toggleEdit = (empresa = null) => {
        setEmpresaSelecionada(empresa);
        if (empresa) {
            reset({
                nome_instituicao: empresa.nome_instituicao,
                email_instituicao: empresa.email_instituicao,
                telefone: empresa.telefone,
                provincia_instituicao: empresa.provincia_instituicao,
                municipio_instituicao: empresa.municipio_instituicao,
                bairro_instituicao: empresa.bairro_instituicao,
            });
        }
        setShowEdit((prev) => !prev);
    }
    const toggleAdd = () => {
        setShowAdd((prev) => !prev);
    }

    async function CadastrarInstituicao(data) {
        try {
            let payload = { ...data };
            if (file) {
                const uploadRes = await enterpriseService.upload(file);
                if (uploadRes && uploadRes.sucesso) {
                    payload.path_logo = uploadRes.path;
                }
            }

            delete payload.file; // Remove FileList do payload

            const response = await enterpriseService.create(payload);
            if (response && response.sucesso) {
                alert("Instituição cadastrada!");
                setShowAdd(false);
                reset();
                setFile(null);
                loadEnterprises();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function ActualizarInstituicao(data) {
        if (!empresaSelecionada) return;
        try {
            let payload = { ...data };
            if (file) {
                const uploadRes = await enterpriseService.upload(file);
                if (uploadRes && uploadRes.sucesso) {
                    payload.path_logo = uploadRes.path;
                }
            } else {
                // Mantém logo antigo
                payload.path_logo = empresaSelecionada.path_logo;
            }
            delete payload.file;

            const response = await enterpriseService.update(empresaSelecionada.id_instituicao, payload);
            if (response && response.sucesso) {
                alert("Instituição atualizada!");
                setShowEdit(false);
                setFile(null);
                loadEnterprises();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function DeletarInstituicao(id) {
        if (window.confirm("Deseja realmente excluir esta instituição?")) {
            try {
                const res = await enterpriseService.delete(id);
                if (res && res.sucesso) {
                    alert("Instituição excluída com sucesso!");
                    loadEnterprises();
                } else {
                    alert("Erro ao excluir: " + (res?.erro || "Erro desconhecido"));
                }
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro de conexão.");
            }
        }
    }


    return (
        <>
            <NavBarAdmin></NavBarAdmin>

            <main className={style.containerEnterprise}>
                <div className={style.headerEnterprise}>
                    <div className={style.barsearch}>
                        <input
                            type="text"
                            placeholder="Pesquisar instituição..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={style.containerController}>
                        <button onClick={toggleAdd} className={style.btnAddManually}><FaPlus /> Adicionar</button>
                    </div>
                </div>
                <div className={style.listEnterprise}>
                    {filtered.length > 0 ? filtered.map((empresa, index) => (
                        <div
                            key={empresa.id_instituicao}
                            className={style.enterprise}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className={style.enterpriseCardInner}>
                                <div className={style.info}>
                                    <div className={style.img}>
                                        <img src={empresa.path_logo ? (empresa.path_logo.startsWith('http') ? empresa.path_logo : `${URL}${empresa.path_logo}`) : logo} alt="" />
                                    </div>
                                    <div className={style.datas}>
                                        <span className={style.entName}>{HighlightText(empresa.nome_instituicao, search)}</span>
                                        <span className={style.entEmail}>{HighlightText(empresa.email_instituicao, search)}</span>
                                        <span className={style.entPhone}><MdPhone /> {empresa.telefone}</span>
                                    </div>
                                </div>

                                <div className={style.option}>
                                    <button onClick={() => toggleView(empresa)} title="Ver Detalhes"><MdPreview size={20} /></button>
                                    <button onClick={() => toggleEdit(empresa)} title="Editar"><MdEdit size={20} /></button>
                                    <button onClick={() => DeletarInstituicao(empresa.id_instituicao)} title="Excluir" className={style.btnDelete}><MdDelete size={20} /></button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className={style.noData}>Nenhuma instituição encontrada.</div>
                    )}
                </div>
            </main>

            <div className={style.containerEdit + `  ${showEdit ? style.ShowContainerEdit : ""}`}>
                <div className={style.cardClose}>
                    <MdClose onClick={toggleEdit} />
                </div>
                <div className={style.cardform}>
                    <form method="post" encType="multipart/form-data" onSubmit={handleSubmit(ActualizarInstituicao)}>
                        <div><h2>Actualizar Empresa</h2></div>

                        <div className={style.inputController}>
                            <label htmlFor="nome_instituicao">Nome da Instituição</label>
                            <input type="text" name="nome_instituicao" id="nome_instituicao" {...register('nome_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.nome_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="email_instituicao">E-mail Instituição</label>
                            <input type="text" name="email_instituicao" id="email_instituicao" {...register('email_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.email_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="telefone">Telefone Instituição</label>
                            <input type="tel" name="telefone " id="telefone" {...register('telefone', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.telefone?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="provincia_instituicao">Província Instituição</label>
                            <input type="text" name="provincia_instituicao" id="provincia_instituicao" {...register('provincia_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.provincia_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                        <div className={style.inputController}>
                            <label htmlFor="municipio_instituicao">Município Instituição</label>
                            <input type="text" name="municipio_instituicao" id="municipio_instituicao" {...register('municipio_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.municipio_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="bairro_instituicao">Bairro Instituição</label>
                            <input type="text" name="bairro_instituicao " id="bairro_instituicao" {...register('bairro_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.bairro_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="file">Logo Da Instituição</label>
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    setFile(selectedFile || null);
                                }}
                            />

                            {

                                errors ? (
                                    <ParagrafoErro error={errors.path_logo?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <input type="submit" value="Salvar Empresa" />
                        </div>
                    </form>
                </div>
            </div>
            <div className={style.containerView + `  ${showView ? style.ShowContainerView : ""}`}>
                <div className={style.cardClose}>
                    <MdClose onClick={toggleView} />
                </div>
                <div className={style.card_descriacao}>
                    <h3>Dados Da Instituição</h3>
                    <div>
                        <span>Nome</span>
                        <span>{empresaSelecionada?.nome_instituicao}</span>
                    </div>
                    <div>
                        <span>Logo Empresa</span>
                        <span> <img src={empresaSelecionada?.path_logo ? (empresaSelecionada.path_logo.startsWith('http') ? empresaSelecionada.path_logo : `${URL}${empresaSelecionada.path_logo}`) : logo} alt="" height={30} width={30} /></span>
                    </div>
                    <div>
                        <span>E-mail</span>
                        <span>{empresaSelecionada?.email_instituicao}</span>
                    </div>
                    <div>
                        <span>Telefone</span>
                        <span>{empresaSelecionada?.telefone}</span>
                    </div>
                    <div>
                        <span>Localizada na Provincia de</span>
                        <span>{empresaSelecionada?.provincia_instituicao}</span>
                    </div>
                    <div>
                        <span>Localizada no Municipio de</span>
                        <span>{empresaSelecionada?.municipio_instituicao}</span>
                    </div>
                    <div>
                        <span>Localizada no Bairro de</span>
                        <span>{empresaSelecionada?.bairro_instituicao}</span>
                    </div>
                </div>
            </div>
            <div className={style.containerAdd + `  ${showAdd ? style.ShowContainerAdd : ""}`}>

                <div className={style.cardForm}>
                    <div className={style.cardClose}>
                        <MdClose onClick={toggleAdd} />
                    </div>
                    <form method="post" encType="multipart/form-data" onSubmit={handleSubmit(CadastrarInstituicao)}>
                        <div><h2>Cadastrar Empresa</h2></div>
                        <div className={style.inputController}>
                            <label htmlFor="nome_instituicao">Nome da Instituição</label>
                            <input type="text" name="nome_instituicao" id="nome_instituicao" {...register('nome_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.nome_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="email_instituicao">E-mail Instituição</label>
                            <input type="text" name="email_instituicao" id="email_instituicao" {...register('email_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.email_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="telefone">Telefone Instituição</label>
                            <input type="tel" name="telefone " id="telefone" {...register('telefone', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.telefone?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="provincia_instituicao">Província Instituição</label>
                            <input type="text" name="provincia_instituicao" id="provincia_instituicao" {...register('provincia_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.provincia_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>

                        <div className={style.inputController}>
                            <label htmlFor="municipio_instituicao">Município Instituição</label>
                            <input type="text" name="municipio_instituicao" id="municipio_instituicao" {...register('municipio_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.municipio_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="bairro_instituicao">Bairro Instituição</label>
                            <input type="text" name="bairro_instituicao " id="bairro_instituicao" {...register('bairro_instituicao', {
                                required: "Este campo é obrigatorios"
                            })} />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.bairro_instituicao?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <label htmlFor="file">Logo Da Instituição</label>
                            <input type="file" name="file" id="file" {...register('file', {
                                required: "Este campo é obrigatorios"
                            })}
                                onChange={(e) => {
                                    const selected = e.target.files && e.target.files[0];
                                    setFile(selected || null);
                                }}

                            />
                            {

                                errors ? (
                                    <ParagrafoErro error={errors.path_logo?.message} />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                        <div className={style.inputController}>
                            <input type="submit" value="Salvar Empresa" />
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}
{/**
    
    <div>Não há Empresas Cadastradas</div>
    */}