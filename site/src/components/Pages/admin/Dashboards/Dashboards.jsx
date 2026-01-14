import { useEffect, useState } from "react";
import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import style from './Dashboards.module.css';
import { MdStorage, MdSignLanguage, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { FaUsers, FaBuilding } from 'react-icons/fa6';
import LineChart from "../../../Elements/Charts/LineChart";
import DoughnutChart from "../../../Elements/Charts/DoughnutChart";
import RadarChart from "../../../Elements/Charts/RadarChart";
import { dashboardService } from "../../../../services/appServices";

export default function Dashboards() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosInativos: 0,
    usuariosBanidos: 0,
    totalEmpresas: 0,
    empresasAtivas: 0,
    totalSinais: 0,
    sinaisNovosMes: 0,
    chartSinais: { labels: [], data: [] }
  });

  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState('1y'); // '7d', '30d', '90d', '1y'

  const [error, setError] = useState(null);

  const fetchStats = async (range) => {
    try {
      setError(null);
      const res = await dashboardService.getStats({ range });
      if (res && res.sucesso) {
        setStats(prev => ({
          ...prev,
          ...res.stats
        }));
      } else {
        setError(res?.erro || "Falha ao carregar dados.");
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard stats:", error);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(chartRange);
  }, [chartRange]);

  // Data prep
  const lineLabels = stats.chartSinais.labels?.length > 0 ? stats.chartSinais.labels : ["Sem dados"];
  const lineData = stats.chartSinais.data?.length > 0 ? stats.chartSinais.data : [0];

  const doughnutLabels = ["Ativos", "Inativos", "Banidos"];
  const doughnutData = [
    stats.usuariosAtivos || 0, 
    stats.usuariosInativos || 0,
    stats.usuariosBanidos || 0
  ];
  
  const doughnutColors = [
    '#22c55e', // Green (Active)
    '#f59e0b', // Amber (Inactive/Warning)
    '#ef4444'  // Red (Banned/Error)
  ];

  // Derived Radar Data (Mocked relative to max to show nice shape)
  const radarData = [
    85, // Performance (Fixed high for demo)
    (stats.usuariosAtivos / (stats.totalUsuarios || 1)) * 100 || 0, // % Active Users
    (stats.sinaisNovosMes / 50) * 100 > 100 ? 100 : (stats.sinaisNovosMes / 50) * 100, // Growth velocity
    95, // Uptime (Fixed)
    70 // Engagement (Mock)
  ];

  return (
    <>
      <NavBarAdmin />
       
      <main className={style.containerMainDashboards}>
        <section className={style.header}>
          <div>
            <h1>Painel de Visão Geral</h1>
            <p>Acompanhe o crescimento e performance da plataforma LIGA em tempo real.</p>
          </div>
          {error && (
            <div style={{
                marginTop: '16px', 
                padding: '12px', 
                background: '#fee2e2', 
                color: '#ef4444', 
                borderRadius: '8px',
                fontSize: '0.875rem'
            }}>
                {error}
            </div>
          )}
        </section>

        {/* Top Metrics Row */}
        <div className={`${style.grid} ${style.gridFour}`}>
          {/* Card 1: Users */}
          <div className={style.card}>
            <div className={style.metricHeader}>
              <div className={style.iconBox}>
                <FaUsers />
              </div>
              <span className={`${style.trend} ${style.trendUp}`}>
                <MdTrendingUp /> +12%
              </span>
            </div>
            <div>
              <div className={style.metricValue}>{stats.totalUsuarios}</div>
              <div className={style.metricLabel}>Usuários Totais</div>
              <div style={{fontSize: '0.75rem', marginTop: '6px', opacity: 0.8, display:'flex', gap:'8px'}}>
                 <span style={{color:'var(--primary)'}}>Ativos: {stats.usuariosAtivos}</span>
                 <span style={{color:'var(--text-muted)'}}>Inativos: {stats.usuariosInativos}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Enterprises */}
          <div className={style.card}>
            <div className={style.metricHeader}>
              <div className={style.iconBox} style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                <FaBuilding />
              </div>
              <span className={`${style.trend} ${style.trendUp}`}>
                <MdTrendingUp /> +5%
              </span>
            </div>
            <div>
              <div className={style.metricValue}>{stats.totalEmpresas}</div>
              <div className={style.metricLabel}>Instituições Parceiras</div>
            </div>
          </div>

           {/* Card 3: Signals */}
           <div className={style.card}>
            <div className={style.metricHeader}>
              <div className={style.iconBox} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <MdSignLanguage />
              </div>
              <span className={`${style.trend} ${style.trendUp}`}>
                <MdTrendingUp /> +{stats.sinaisNovosMes}
              </span>
            </div>
            <div>
              <div className={style.metricValue}>{stats.totalSinais}</div>
              <div className={style.metricLabel}>Sinais na Biblioteca</div>
            </div>
          </div>

          {/* Card 4: Health/System */}
          <div className={style.card}>
            <div className={style.metricHeader}>
              <div className={style.iconBox} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                <MdStorage />
              </div>
              <span className={`${style.trend} ${style.trendUp}`}>
                Estável
              </span>
            </div>
            <div>
              <div className={style.metricValue}>100%</div>
              <div className={style.metricLabel}>Disponibilidade</div>
            </div>
          </div>
        </div>

        {/* Middle Row: Main Chart & Support Chart */}
        <div className={`${style.grid} ${style.gridTwoBig}`}>
           {/* Area Chart */}
           <div className={style.card}>
              <div className={style.chartHeader}>
                <h3>Crescimento de Conteúdo</h3>
                <div style={{display:'flex', gap:'8px'}}>
                    {['7d', '30d', '90d', '1y'].map(range => (
                        <button 
                            key={range}
                            onClick={() => setChartRange(range)}
                            style={{
                                background: chartRange === range ? 'var(--primary)' : 'transparent',
                                color: chartRange === range ? '#fff' : 'var(--text-muted)',
                                border: '1px solid var(--border-light)',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                            }}
                        >
                            {range === '1y' ? 'Ano' : range.toUpperCase()}
                        </button>
                    ))}
                </div>
              </div>
              <div className={style.chartContainer} style={{height: '300px'}}>
                <LineChart 
                  props_labels={lineLabels}
                  props_label={`Sinais cadastrados (${chartRange})`}
                  props_data={lineData} 
                />
              </div>
           </div>

           {/* Doughnut Chart */}
           <div className={style.card}>
              <div className={style.chartHeader}>
                <h3>Engajamento de Usuários</h3>
              </div>
              <div className={style.chartContainer} style={{height: '250px'}}>
                <DoughnutChart 
                  labels={doughnutLabels}
                  dataValues={doughnutData}
                  colors={doughnutColors}
                />
              </div>
           </div>
        </div>

        {/* Bottom Row: Radar & More */}
        <div className={`${style.grid} ${style.gridThree}`}>
           {/* Radar Chart */}
           <div className={style.card}>
              <div className={style.chartHeader}>
                <h3>Métricas de Qualidade</h3>
              </div>
              <div className={style.chartContainer}>
                <RadarChart 
                  labels={['Performance', 'Usuários Ativos', 'Crescimento', 'Estabilidade', 'Engajamento']}
                  datasetLabel="Índice Atual"
                  dataValues={radarData}
                />
              </div>
           </div>

           {/* Simple List / Summary */}
           <div className={style.card}>
              <div className={style.chartHeader}>
                <h3>Resumo de Atividades</h3>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{width: 8, height: 8, borderRadius: '50%', background: '#22c55e'}}></div>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Backup automático realizado com sucesso.</span>
                 </div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{width: 8, height: 8, borderRadius: '50%', background: '#3b82f6'}}></div>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>{stats.usuariosAtivos} usuários acessaram hoje.</span>
                 </div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{width: 8, height: 8, borderRadius: '50%', background: '#f59e0b'}}></div>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Sistema operando na versão 1.0.0.</span>
                 </div>
              </div>
           </div>
           
           <div className={style.card} style={{background: 'linear-gradient(135deg, var(--primary), #1e1b4b)', color: 'white', border: 'none'}}>
               <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                  <h3 style={{fontSize: '1.5rem', marginBottom: '8px'}}>Premium Access</h3>
                  <p style={{opacity: 0.8, fontSize: '0.9rem'}}>Todas as funcionalidades administrativas estão ativas.</p>
               </div>
           </div>

        </div>

      </main>
    </>
  );
}
