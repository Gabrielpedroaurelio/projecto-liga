import NavBarAdmin from '../../../Elements/NavBarAdmin/NavBarAdmin';
import style from './Reports.module.css';
import { MdPictureAsPdf, MdTableView, MdPeople, MdHistory, MdSignLanguage, MdAssessment, MdBusiness, MdCategory } from 'react-icons/md';
import { userService, signalService, historyService, enterpriseService, categoryService } from '../../../../services/appServices';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx/xlsx.mjs';
import { saveAs } from 'file-saver';

export default function Reports() {

    const reports = [
        {
            id: 'users',
            title: 'Relatório de Usuários',
            description: 'Lista completa de usuários cadastrados, incluindo status, perfil e contato.',
            icon: <MdPeople />,
            color: '#3b82f6'
        },
        {
            id: 'companies',
            title: 'Instituições Parceiras',
            description: 'Relatório das empresas e instituições registradas na plataforma.',
            icon: <MdBusiness />,
            color: '#8b5cf6'
        },
        {
            id: 'signals',
            title: 'Catálogo de Sinais',
            description: 'Inventário completo de sinais da LIGA com categorias e autores.',
            icon: <MdSignLanguage />,
            color: '#10b981'
        },
        {
            id: 'categories',
            title: 'Categorias de Sinais',
            description: 'Listagem das categorias temáticas cadastradas.',
            icon: <MdCategory />,
            color: '#ec4899'
        },
        {
            id: 'logins',
            title: 'Histórico de Acessos',
            description: 'Log de entradas e saídas do sistema (Login/Logout).',
            icon: <MdHistory />,
            color: '#f59e0b'
        }
    ];

    const fetchReportData = async (type) => {
        let data = [];
        let columns = [];
        let filename = `relatorio_${type}`;

        try {
            switch (type) {
                case 'users':
                    const resUsers = await userService.list();
                    if (resUsers.sucesso) {
                        data = resUsers.usuario.map(u => ({
                            ID: u.id_usuario,
                            Nome: u.nome_completo,
                            Email: u.email,
                            Perfil: u.type_user || u.nome_perfil,
                            Status: u.status_usuario,
                            'Último Login': u.ultimo_login ? new Date(u.ultimo_login).toLocaleString() : 'N/A'
                        }));
                    }
                    columns = ['ID', 'Nome', 'Email', 'Perfil', 'Status', 'Último Login'];
                    break;

                case 'companies':
                    const resComp = await enterpriseService.list();
                    if (resComp.sucesso) {
                        // Ajustar conforme a resposta real da API de empresas
                        // Supondo que venha em resComp.instituicao ou resComp.empresas
                        const list = resComp.instituicao || resComp.empresas || []; 
                        data = list.map(c => ({
                            ID: c.codigo_instituicao || c.id_instituicao,
                            Nome: c.nome_instituicao,
                            Email: c.email_instituicao || 'N/A',
                            Telefone: c.telefone || 'N/A',
                            Localização: c.localizacao ? JSON.stringify(c.localizacao) : 'N/A'
                        }));
                    }
                    columns = ['ID', 'Nome', 'Email', 'Telefone', 'Localização'];
                    break;

                case 'signals':
                    const resSignals = await signalService.list();
                    if (resSignals.sucesso) {
                        data = resSignals.sinais.map(s => ({
                            ID: s.id_sinal,
                            Palavra: s.palavra_portugues,
                            Categoria: s.categoria,
                            Instituição: s.nome_instituicao || 'N/A',
                            'Data Registro': new Date(s.data_registo).toLocaleDateString()
                        }));
                    }
                    columns = ['ID', 'Palavra', 'Categoria', 'Instituição', 'Data Registro'];
                    break;

                case 'categories':
                    const resCats = await categoryService.list();
                    if (resCats.sucesso) {
                         // Supondo resCats.categoria ou resCats.categorias
                         const listC = resCats.categoria || resCats.categorias || [];
                        data = listC.map(c => ({
                            Categoria: c.categoria,
                            'Qtd Sinais': c.qtd_sinais || 0
                        }));
                    }
                    columns = ['Categoria', 'Qtd Sinais'];
                    break;

                case 'logins':
                    const resLogins = await historyService.getLogins();
                    if (resLogins.sucesso) {
                        data = resLogins.historico.map(h => ({
                            Usuário: h.nome_completo,
                            Email: h.email,
                            Entrada: new Date(h.data_hora_entrada).toLocaleString(),
                            Saída: h.data_hora_saida ? new Date(h.data_hora_saida).toLocaleString() : 'Ativo',
                            IP: h.ip_acesso || 'N/A',
                            Dispositivo: h.dispositivo || 'N/A'
                        }));
                    }
                    columns = ['Usuário', 'Email', 'Entrada', 'Saída', 'IP', 'Dispositivo'];
                    break;
                
                default:
                    throw new Error("Tipo de relatório desconhecido");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar dados para o relatório.");
            return null;
        }

        return { data, columns, filename };
    };

    const generatePDF = (reportData, title) => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Project LIGA - Relatório do Sistema", 14, 22);
        
        doc.setFontSize(14);
        doc.text(title, 14, 32);
        
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 40);

        const tableColumn = reportData.columns;
        const tableRows = reportData.data.map(obj => Object.values(obj));

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.save(`${reportData.filename}.pdf`);
    };

    const generateExcel = (reportData) => {
        const worksheet = XLSX.utils.json_to_sheet(reportData.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
        
        // Gera o buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        
        saveAs(dataBlob, `${reportData.filename}.xlsx`);
    };

    const handleGenerate = async (type, format, title) => {
        const reportData = await fetchReportData(type);
        
        if (!reportData || reportData.data.length === 0) {
            alert("Nenhum dado encontrado para gerar este relatório.");
            return;
        }

        if (format === 'pdf') {
            generatePDF(reportData, title);
        } else if (format === 'csv') { // Using 'csv' identifier for Excel button
            generateExcel(reportData);
        }
    };

    return (
        <>
            <NavBarAdmin />
            <main className={style.container}>
                <div className={style.header}>
                    <h1>Central de Relatórios</h1>
                    <p>Exporte dados do sistema para análise e arquivamento.</p>
                </div>

                <div className={style.grid}>
                    {reports.map((repo) => (
                        <div key={repo.id} className={style.card}>
                            <div>
                                <div className={style.cardHeader}>
                                    <div className={style.iconBox} style={{color: repo.color, background: `${repo.color}1a`}}>
                                        {repo.icon}
                                    </div>
                                </div>
                                <div className={style.cardTitle}>
                                    <h3>{repo.title}</h3>
                                    <p>{repo.description}</p>
                                </div>
                            </div>

                            <div className={style.actions}>
                                <button 
                                    className={`${style.btnAction} ${style.btnPdf}`}
                                    onClick={() => handleGenerate(repo.id, 'pdf', repo.title)}
                                    title="Exportar como PDF"
                                >
                                    <MdPictureAsPdf size={18} /> PDF
                                </button>
                                <button 
                                    className={`${style.btnAction} ${style.btnExcel}`}
                                    onClick={() => handleGenerate(repo.id, 'csv', repo.title)}
                                    title="Exportar como Excel/CSV"
                                >
                                    <MdTableView size={18} /> Excel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
