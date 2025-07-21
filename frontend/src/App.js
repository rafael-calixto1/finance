import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart, registerables } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(...registerables);

function App() {
    const [simulationRequest, setSimulationRequest] = useState({
        initialAmount: '',
        monthlyContribution: '0',
        interestRate: '',
        interestRateType: 'mensal',
        investmentTime: '',
        investmentTimeUnit: 'anos',
    });
    const [simulationResult, setSimulationResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedGraphSeries, setSelectedGraphSeries] = useState([
        'totalInvested',
        'totalAccumulated',
    ]);

    const chartRef = useRef(null);

    useEffect(() => {
        if (simulationResult) {
            const months = simulationResult.monthlyData.map(data => `Mês ${data.month}`);

            const datasets = [];

            if (selectedGraphSeries.includes('totalInvested')) {
                datasets.push({
                    label: 'Total Investido',
                    data: simulationResult.monthlyData.map(data => data.cumulativeInvested),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                });
            }
            if (selectedGraphSeries.includes('totalInterest')) {
                datasets.push({
                    label: 'Juros Acumulados',
                    data: simulationResult.monthlyData.map(data => data.cumulativeInterest),
                    borderColor: 'rgb(255, 159, 64)',
                    tension: 0.1,
                    fill: false
                });
            }
            if (selectedGraphSeries.includes('totalAccumulated')) {
                datasets.push({
                    label: 'Total Acumulado',
                    data: simulationResult.monthlyData.map(data => data.totalAccumulated),
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    fill: false
                });
            }

            if (chartRef.current) {
                // Destroy existing chart if it exists
                if (chartRef.current.chartInstance) {
                    chartRef.current.chartInstance.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                chartRef.current.chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                        }
                                        return label;
                                    },
                                    title: function(context) {
                                        return `Mês ${context[0].dataIndex + 1}`;
                                    },
                                    afterBody: function(context) {
                                        if (simulationResult && context.length > 0) {
                                            const dataIndex = context[0].dataIndex;
                                            const monthlyData = simulationResult.monthlyData[dataIndex];
                                            let tooltipText = [];

                                            tooltipText.push(`Total Investido: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyData.cumulativeInvested)}`);
                                            tooltipText.push(`Juros Acumulados: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyData.cumulativeInterest)}`);
                                            tooltipText.push(`Total Acumulado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyData.totalAccumulated)}`);

                                            return tooltipText;
                                        }
                                        return '';
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Valor (R$)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Mês'
                                }
                            }
                        }
                    }
                });
            }
        }
    }, [simulationResult, selectedGraphSeries]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Replace comma with dot for number fields that should accept comma as decimal
        if (name === 'initialAmount' || name === 'monthlyContribution' || name === 'interestRate') {
            formattedValue = value.replace(/,/g, '.');
        }

        setSimulationRequest({ ...simulationRequest, [name]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSimulationResult(null);

        try {
            const response = await axios.post('http://localhost:8080/api/simulation', simulationRequest);
            setSimulationResult(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data;
                let errorMsg = '';
                for (const key in errors) {
                    errorMsg += `${errors[key]}<br/>`;
                }
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage('Ocorreu um erro ao simular. Por favor, tente novamente.');
            }
        }
    };

    const handleClear = () => {
        setSimulationRequest({
            initialAmount: '',
            monthlyContribution: '0',
            interestRate: '',
            interestRateType: 'mensal',
            investmentTime: '',
            investmentTimeUnit: 'anos',
        });
        setSimulationResult(null);
        setErrorMessage('');
    };

    

    const handleGraphSeriesChange = (e) => {
        const { value, checked } = e.target;
        setSelectedGraphSeries(prev =>
            checked ? [...prev, value] : prev.filter(series => series !== value)
        );
    };

    return (
        <div>
            {/* Header Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        SuaLogoAQUI
                    </a>
                    {/* Optional: Top Navigation */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Notícias</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Empresas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Calculadoras</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            

            <div className="container my-4">
                <div className="card shadow-lg rounded-3">
                    <div className="card-header bg-danger text-white text-center py-3">
                        <h2 className="mb-0">Simulador de Juros Compostos</h2>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert" dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
                            )}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="initialAmount" className="form-label">Valor Inicial (R$):</label>
                                    <input type="number" className="form-control" id="initialAmount" name="initialAmount" value={simulationRequest.initialAmount} onChange={handleChange} placeholder="Ex: 10000" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="monthlyContribution" className="form-label">Aportes Mensais (R$):</label>
                                    <input type="number" className="form-control" id="monthlyContribution" name="monthlyContribution" value={simulationRequest.monthlyContribution} onChange={handleChange} placeholder="Ex: 200" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="interestRate" className="form-label">Taxa de Juros (%):</label>
                                    <input type="number" step="0.01" className="form-control" id="interestRate" name="interestRate" value={simulationRequest.interestRate} onChange={handleChange} placeholder="Ex: 0.5" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="interestRateType" className="form-label">Tipo da Taxa:</label>
                                    <select className="form-select" id="interestRateType" name="interestRateType" value={simulationRequest.interestRateType} onChange={handleChange}>
                                        <option value="mensal">Mensal</option>
                                        <option value="anual">Anual</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="investmentTime" className="form-label">Tempo de Investimento:</label>
                                    <input type="number" className="form-control" id="investmentTime" name="investmentTime" value={simulationRequest.investmentTime} onChange={handleChange} placeholder="Ex: 10" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="investmentTimeUnit" className="form-label">Unidade de Tempo:</label>
                                    <select className="form-select" id="investmentTimeUnit" name="investmentTimeUnit" value={simulationRequest.investmentTimeUnit} onChange={handleChange}>
                                        <option value="meses">Meses</option>
                                        <option value="anos">Anos</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" className="btn btn-danger btn-lg shadow-sm">Simular</button>
                                <button type="button" className="btn btn-outline-secondary btn-lg shadow-sm" onClick={handleClear}>Limpar</button>
                            </div>
                        </form>
                    </div>
                </div>

                {simulationResult && (
                    <div className="result-section mt-4">
                        <h3 className="text-center mb-4 text-danger">Resultados da Simulação</h3>
                        <div className="row g-3 mb-4">
                            {/* Valor Total Final */}
                            <div className="col-md-4">
                                <div className="card bg-danger text-white shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Valor Total Final</h5>
                                        <p className="fs-3 fw-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResult.finalTotalAmount)}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Valor Total Investido */}
                            <div className="col-md-4">
                                <div className="card shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-danger">Valor Total Investido</h5>
                                        <p className="fs-4 fw-bold text-info">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResult.totalInvestedAmount)}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Total em Juros */}
                            <div className="col-md-4">
                                <div className="card shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-danger">Total em Juros</h5>
                                        <p className="fs-4 fw-bold text-warning">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResult.totalInterestEarned)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="card shadow-sm rounded mb-4">
                            <div className="card-body">
                                <h4 className="card-title text-danger mb-3">Gráfico de Acumulação</h4>
                                <div className="mb-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkInvested" value="totalInvested" checked={selectedGraphSeries.includes('totalInvested')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkInvested">Total Investido</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkInterest" value="totalInterest" checked={selectedGraphSeries.includes('totalInterest')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkInterest">Juros Acumulados</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkAccumulated" value="totalAccumulated" checked={selectedGraphSeries.includes('totalAccumulated')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkAccumulated">Total Acumulado</label>
                                    </div>
                                </div>
                                <canvas id="myChart" ref={chartRef}></canvas>
                            </div>
                        </div>

                        {/* Data Table Section */}
                        <div className="card shadow-sm rounded">
                            <div className="card-body">
                                <h4 className="card-title text-danger mb-3">Detalhes Mensais</h4>
                                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mês</th>
                                                <th>Juros</th>
                                                <th>Total Investido</th>
                                                <th>Total em Juros</th>
                                                <th>Total Acumulado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {simulationResult.monthlyData.map((data) => (
                                                <tr key={data.month}>
                                                    <td>{data.month}</td>
                                                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.interest)}</td>
                                                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.cumulativeInvested)}</td>
                                                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.cumulativeInterest)}</td>
                                                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalAccumulated)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="container my-5">
                            <h3 className="text-danger mb-4">Como funcionam os juros compostos e onde são aplicados</h3>

                            <h4 className="mb-3">Fórmula dos juros compostos</h4>
                            <p>A fórmula usada para calcular os juros compostos é:</p>
                            <pre className="bg-light p-3 rounded border">M = C × (1 + i)<sup>t</sup></pre>

                            <p>
                                Onde:
                                <ul>
                                    <li><strong>M</strong>: montante acumulado</li>
                                    <li><strong>C</strong>: capital inicial</li>
                                    <li><strong>i</strong>: taxa de juros (decimal)</li>
                                    <li><strong>t</strong>: tempo da aplicação</li>
                                </ul>
                            </p>

                            <p>
                                Lembre-se de manter unidade de tempo e taxa consistentes. Ex: taxa mensal → tempo em meses.
                            </p>

                            <hr />

                            <h4 className="mb-3">Onde os juros compostos são utilizados</h4>

                            <h5>1. Contas e faturas atrasadas</h5>
                            <p>Juros compostos penalizam atrasos. A dívida cresce rapidamente com o tempo.</p>

                            <h5>2. Empréstimos e financiamentos</h5>
                            <p>Utilizados por instituições para garantir retorno, mas aumentam o custo para o cliente.</p>

                            <h5>3. Investimentos</h5>
                            <p>Ativos como CDBs, CRIs, Tesouro Direto e reinvestimento de dividendos se beneficiam do efeito composto.</p>

                            <hr />

                            <h4 className="mb-3">Diferença entre juros simples e compostos</h4>

                            <div className="row">
                                <div className="col-md-6">
                                    <h5>Juros Simples</h5>
                                    <ul>
                                        <li>Incidem apenas sobre o capital inicial</li>
                                        <li>Crescimento linear</li>
                                        <li>Pagos periodicamente</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h5>Juros Compostos</h5>
                                    <ul>
                                        <li>Calculados sobre capital + juros acumulados</li>
                                        <li>Crescimento exponencial</li>
                                        <li>Pagos no final ou capitalizados</li>
                                    </ul>
                                </div>
                            </div>

                            <hr />

                            <h4 className="mb-3">Exemplo comparativo</h4>
                            <p>Investimento de <strong>R$ 5.000</strong> com <strong>1% ao mês</strong> sem novos aportes:</p>

                            <ul>
                                <li><strong>12 meses</strong>:
                                    <ul>
                                        <li>Juros simples: R$ 5.600,00</li>
                                        <li>Juros compostos: R$ 5.634,13</li>
                                    </ul>
                                </li>
                            </ul>

                            <div className="table-responsive">
                                <table className="table table-bordered text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Prazo</th>
                                            <th>Juros Simples</th>
                                            <th>Juros Compostos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>5 anos</td>
                                            <td>R$ 8.000,00</td>
                                            <td>R$ 9.083,48</td>
                                        </tr>
                                        <tr>
                                            <td>10 anos</td>
                                            <td>R$ 11.000,00</td>
                                            <td>R$ 16.501,93</td>
                                        </tr>
                                        <tr>
                                            <td>20 anos</td>
                                            <td>R$ 17.000,00</td>
                                            <td>R$ 54.462,77</td>
                                        </tr>
                                        <tr>
                                            <td>30 anos</td>
                                            <td>R$ 23.000,00</td>
                                            <td>R$ 179.748,21</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                Fica claro que, com o passar dos anos, os <strong>juros compostos</strong> proporcionam um crescimento muito mais expressivo — tanto para quem investe quanto para quem deve.
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </div>
            
    );
}

export default App;