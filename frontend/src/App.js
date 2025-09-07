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
        interestRateType: 'monthly',
        investmentTime: '',
        investmentTimeUnit: 'years',
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
            const months = simulationResult.monthlyData.map(data => `Month ${data.month}`);

            const datasets = [];

            if (selectedGraphSeries.includes('totalInvested')) {
                datasets.push({
                    label: 'Total Invested',
                    data: simulationResult.monthlyData.map(data => data.cumulativeInvested),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                });
            }
            if (selectedGraphSeries.includes('totalInterest')) {
                datasets.push({
                    label: 'Cumulative Interest',
                    data: simulationResult.monthlyData.map(data => data.cumulativeInterest),
                    borderColor: 'rgb(255, 159, 64)',
                    tension: 0.1,
                    fill: false
                });
            }
            if (selectedGraphSeries.includes('totalAccumulated')) {
                datasets.push({
                    label: 'Total Accumulated',
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
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                        }
                                        return label;
                                    },
                                    title: function(context) {
                                        return `Month ${context[0].dataIndex + 1}`;
                                    },
                                    afterBody: function(context) {
                                        if (simulationResult && context.length > 0) {
                                            const dataIndex = context[0].dataIndex;
                                            const monthlyData = simulationResult.monthlyData[dataIndex];
                                            let tooltipText = [];

                                            tooltipText.push(`Total Invested: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyData.cumulativeInvested)}`);
                                            tooltipText.push(`Cumulative Interest: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyData.cumulativeInterest)}`);
                                            tooltipText.push(`Total Accumulated: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyData.totalAccumulated)}`);

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
                                    text: 'Value ($)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Month'
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
            const response = await axios.post('http://localhost:8081/api/simulation', simulationRequest);
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
                setErrorMessage('An error occurred while simulating. Please try again.');
            }
        }
    };

    const handleClear = () => {
        setSimulationRequest({
            initialAmount: '',
            monthlyContribution: '0',
            interestRate: '',
            interestRateType: 'monthly',
            investmentTime: '',
            investmentTimeUnit: 'years',
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
                        YourLogoHERE
                    </a>
                    {/* Optional: Top Navigation */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">News</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Companies</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Calculators</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            

            <div className="container my-4">
                <div className="card shadow-lg rounded-3">
                    <div className="card-header bg-danger text-white text-center py-3">
                        <h2 className="mb-0">Compound Interest Simulator</h2>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert" dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
                            )}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="initialAmount" className="form-label">Initial Amount ($):</label>
                                    <input type="text" className="form-control" id="initialAmount" name="initialAmount" value={simulationRequest.initialAmount} onChange={handleChange} placeholder="Ex: 10000" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="monthlyContribution" className="form-label">Monthly Contribution ($):</label>
                                    <input type="text" className="form-control" id="monthlyContribution" name="monthlyContribution" value={simulationRequest.monthlyContribution} onChange={handleChange} placeholder="Ex: 200" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="interestRate" className="form-label">Interest Rate (%):</label>
                                    <input type="text" step="0.01" className="form-control" id="interestRate" name="interestRate" value={simulationRequest.interestRate} onChange={handleChange} placeholder="Ex: 0.5" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="interestRateType" className="form-label">Rate Type:</label>
                                    <select className="form-select" id="interestRateType" name="interestRateType" value={simulationRequest.interestRateType} onChange={handleChange}>
                                        <option value="monthly">Monthly</option>
                                        <option value="annual">Annual</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label htmlFor="investmentTime" className="form-label">Investment Time:</label>
                                    <input type="number" className="form-control" id="investmentTime" name="investmentTime" value={simulationRequest.investmentTime} onChange={handleChange} placeholder="Ex: 10" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="investmentTimeUnit" className="form-label">Time Unit:</label>
                                    <select className="form-select" id="investmentTimeUnit" name="investmentTimeUnit" value={simulationRequest.investmentTimeUnit} onChange={handleChange}>
                                        <option value="months">Months</option>
                                        <option value="years">Years</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="submit" className="btn btn-danger btn-lg shadow-sm">Simulate</button>
                                <button type="button" className="btn btn-outline-secondary btn-lg shadow-sm" onClick={handleClear}>Clear</button>
                            </div>
                        </form>
                    </div>
                </div>

                {simulationResult && (
                    <div className="result-section mt-4">
                        <h3 className="text-center mb-4 text-danger">Simulation Results</h3>
                        <div className="row g-3 mb-4">
                            {/* Valor Total Final */}
                            <div className="col-md-4">
                                <div className="card bg-danger text-white shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Final Total Amount</h5>
                                        <p className="fs-3 fw-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(simulationResult.finalTotalAmount)}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Valor Total Investido */}
                            <div className="col-md-4">
                                <div className="card shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-danger">Total Invested Amount</h5>
                                        <p className="fs-4 fw-bold text-info">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(simulationResult.totalInvestedAmount)}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Total em Juros */}
                            <div className="col-md-4">
                                <div className="card shadow-sm rounded h-100">
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-danger">Total Interest Earned</h5>
                                        <p className="fs-4 fw-bold text-warning">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(simulationResult.totalInterestEarned)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="card shadow-sm rounded mb-4">
                            <div className="card-body">
                                <h4 className="card-title text-danger mb-3">Accumulation Chart</h4>
                                <div className="mb-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkInvested" value="totalInvested" checked={selectedGraphSeries.includes('totalInvested')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkInvested">Total Invested</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkInterest" value="totalInterest" checked={selectedGraphSeries.includes('totalInterest')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkInterest">Cumulative Interest</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="checkAccumulated" value="totalAccumulated" checked={selectedGraphSeries.includes('totalAccumulated')} onChange={handleGraphSeriesChange} />
                                        <label className="form-check-label" htmlFor="checkAccumulated">Total Accumulated</label>
                                    </div>
                                </div>
                                <canvas id="myChart" ref={chartRef}></canvas>
                            </div>
                        </div>

                        {/* Data Table Section */}
                        {/* Data Table Section */}
                        <div className="card shadow-sm rounded">
                            <div className="card-body">
                                <h4 className="card-title text-danger mb-3">Monthly Details</h4>
                                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th>Interest</th>
                                                <th>Total Invested</th>
                                                <th>Total in Interest</th>
                                                <th>Total Accumulated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {simulationResult.monthlyData.map((data) => (
                                                <tr key={data.month}>
                                                    <td>{data.month}</td>
                                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.interest)}</td>
                                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.cumulativeInvested)}</td>
                                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.cumulativeInterest)}</td>
                                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.totalAccumulated)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="container my-5">
                            <h3 className="text-danger mb-4">How compound interest works and where it is applied</h3>

                            <h4 className="mb-3">Compound interest formula</h4>
                            <p>The formula used to calculate compound interest is:</p>
                            <pre className="bg-light p-3 rounded border">M = C × (1 + i)<sup>t</sup></pre>

                            <p>
                                Where:
                                <ul>
                                    <li><strong>M</strong>: accumulated amount</li>
                                    <li><strong>C</strong>: initial capital</li>
                                    <li><strong>i</strong>: interest rate (decimal)</li>
                                    <li><strong>t</strong>: application time</li>
                                </ul>
                            </p>

                            <p>
                                Remember to keep the time unit and rate consistent. Ex: monthly rate → time in months.
                            </p>

                            <hr />

                            <h4 className="mb-3">Where compound interest is used</h4>

                            <h5>1. Overdue bills and invoices</h5>
                            <p>Compound interest penalizes delays. The debt grows rapidly over time.</p>

                            <h5>2. Loans and financing</h5>
                            <p>Used by institutions to ensure a return, but they increase the cost for the client.</p>

                            <h5>3. Investments</h5>
                            <p>Assets such as CDBs, CRIs, Tesouro Direto and dividend reinvestment benefit from the compound effect.</p>

                            <hr />

                            <h4 className="mb-3">Difference between simple and compound interest</h4>

                            <div className="row">
                                <div className="col-md-6">
                                    <h5>Simple Interest</h5>
                                    <ul>
                                        <li>Calculated only on the initial capital</li>
                                        <li>Linear growth</li>
                                        <li>Paid periodically</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <h5>Compound Interest</h5>
                                    <ul>
                                        <li>Calculated on capital + accumulated interest</li>
                                        <li>Exponential growth</li>
                                        <li>Paid at the end or capitalized</li>
                                    </ul>
                                </div>
                            </div>

                            <hr />

                            <h4 className="mb-3">Comparative example</h4>
                            <p>Investment of <strong>$ 5,000</strong> with <strong>1% per month</strong> without new contributions:</p>

                            <ul>
                                <li><strong>12 months</strong>:
                                    <ul>
                                        <li>Simple interest: $ 5,600.00</li>
                                        <li>Compound interest: $ 5,634.13</li>
                                    </ul>
                                </li>
                            </ul>

                            <div className="table-responsive">
                                <table className="table table-bordered text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Term</th>
                                            <th>Simple Interest</th>
                                            <th>Compound Interest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>5 years</td>
                                            <td>$ 8,000.00</td>
                                            <td>$ 9,083.48</td>
                                        </tr>
                                        <tr>
                                            <td>10 years</td>
                                            <td>$ 11,000.00</td>
                                            <td>$ 16,501.93</td>
                                        </tr>
                                        <tr>
                                            <td>20 years</td>
                                            <td>$ 17,000.00</td>
                                            <td>$ 54,462.77</td>
                                        </tr>
                                        <tr>
                                            <td>30 years</td>
                                            <td>$ 23,000.00</td>
                                            <td>$ 179,748.21</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                It is clear that, over the years, <strong>compound interest</strong> provides a much more expressive growth — both for those who invest and for those who owe.
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </div>
            
    );
}

export default App;