let shareholdersData = {}
let currentYear = "2024"

// Load shareholders data
async function loadShareholdersData() {
  try {
    const response = await fetch("data/shareholders.json")
    shareholdersData = await response.json()
    renderYearButtons()
    renderFinancialData(currentYear)
  } catch (error) {
    console.error("Error loading shareholders data:", error)
  }
}

// Render year selection buttons
function renderYearButtons() {
  const yearButtons = document.getElementById("year-buttons")
  const years = Object.keys(shareholdersData).sort((a, b) => b - a)

  yearButtons.innerHTML = years
    .map(
      (year) => `
        <button class="year-btn ${year === currentYear ? "active" : ""}" 
                onclick="selectYear('${year}')">${year}</button>
    `,
    )
    .join("")
}

// Select year and update display
function selectYear(year) {
  currentYear = year
  renderYearButtons()
  renderFinancialData(year)
}

// Render financial data for selected year
function renderFinancialData(year) {
  const data = shareholdersData[year]
  if (!data) return

  renderKeyMetrics(data.keyMetrics)
  renderFinancialReports(data)
}

// Render key metrics cards
function renderKeyMetrics(metrics) {
  const keyMetricsContainer = document.getElementById("key-metrics")

  keyMetricsContainer.innerHTML = `
        <h2>Ключевые показатели за ${currentYear} год</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <div class="metric-value">${metrics.revenue} </div>
                <div class="metric-label">Выручка</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                    </svg>
                </div>
                <div class="metric-value">${metrics.netIncome} </div>
                <div class="metric-label">Чистая прибыль</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>
                <div class="metric-value">${metrics.totalAssets} </div>
                <div class="metric-label">Общие активы</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="metric-value">${metrics.equity} </div>
                <div class="metric-label">Собственный капитал</div>
            </div>
        </div>
    `
}

// Render financial reports with accordions
function renderFinancialReports(data) {
  const reportsContainer = document.getElementById("financial-reports")

  if (data.balanceSheet) {
    reportsContainer.innerHTML = `
            <h2>Финансовая отчетность за ${currentYear} год</h2>
            <div class="report-accordions">
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion('balance')">
                        <h3>Бухгалтерский баланс</h3>
                        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                    <div class="accordion-content" id="balance-content">
                        ${renderBalanceSheet(data.balanceSheet)}
                    </div>
                </div>
                
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion('income')">
                        <h3>Отчет о прибылях и убытках</h3>
                        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                    <div class="accordion-content" id="income-content">
                        ${renderIncomeStatement(data.incomeStatement)}
                    </div>
                </div>
                
                ${
                  data.equityChanges
                    ? `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion('equity')">
                        <h3>Отчет об изменении собственного капитала</h3>
                        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                    <div class="accordion-content" id="equity-content">
                        ${renderEquityChanges(data.equityChanges)}
                    </div>
                </div>
                `
                    : ""
                }
                
                ${
                  data.cashFlow
                    ? `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion('cashflow')">
                        <h3>Отчет о движении денежных средств</h3>
                        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                    <div class="accordion-content" id="cashflow-content">
                        ${renderCashFlow(data.cashFlow)}
                    </div>
                </div>
                `
                    : ""
                }
                
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion('company')">
                        <h3>Информация об организации</h3>
                        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                    <div class="accordion-content" id="company-content">
                        ${renderCompanyInfo(data.companyInfo)}
                    </div>
                </div>
            </div>
        `
  } else {
    reportsContainer.innerHTML = `
            <h2>Финансовая отчетность за ${currentYear} год</h2>
            <div class="no-data">
                <p>Данные за ${currentYear} год будут добавлены позже</p>
            </div>
        `
  }
}

// Render balance sheet
function renderBalanceSheet(balanceSheet) {
  const assets = balanceSheet.assets
  const liabilities = balanceSheet.liabilities
  const equity = balanceSheet.equity

  return `
        <div class="balance-sheet">
            <div class="balance-section">
                <h4>АКТИВЫ</h4>
                <div class="balance-group">
                    <h5>I. ДОЛГОСРОЧНЫЕ АКТИВЫ</h5>
                    <div class="balance-item">
                        <span>Основные средства</span>
                        <span>${assets.nonCurrentAssets.fixedAssets}</span>
                    </div>
                    <div class="balance-item">
                        <span>Нематериальные активы</span>
                        <span>${assets.nonCurrentAssets.intangibleAssets}</span>
                    </div>
                    <div class="balance-item">
                        <span>Вложения в долгосрочные активы</span>
                        <span>${assets.nonCurrentAssets.longTermInvestments}</span>
                    </div>
                    <div class="balance-item">
                        <span>Долгосрочные финансовые вложения</span>
                        <span>${assets.nonCurrentAssets.longTermFinancialInvestments}</span>
                    </div>
                    <div class="balance-item">
                        <span>Долгосрочная дебиторская задолженность</span>
                        <span>${assets.nonCurrentAssets.longTermReceivables}</span>
                    </div>
                    <div class="balance-total">
                        <span>ИТОГО по разделу I</span>
                        <span>${assets.nonCurrentAssets.total}</span>
                    </div>
                </div>
                
                <div class="balance-group">
                    <h5>II. КРАТКОСРОЧНЫЕ АКТИВЫ</h5>
                    <div class="balance-subgroup">
                        <div class="balance-item">
                            <span>Запасы - всего</span>
                            <span>${assets.currentAssets.inventory.total}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>в том числе: материалы</span>
                            <span>${assets.currentAssets.inventory.materials}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>животные на выращивании и откорме</span>
                            <span>${assets.currentAssets.inventory.livestock}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>незавершенное производство</span>
                            <span>${assets.currentAssets.inventory.workInProgress}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>готовая продукция и товары</span>
                            <span>${assets.currentAssets.inventory.finishedGoods}</span>
                        </div>
                    </div>
                    <div class="balance-item">
                        <span>Расходы будущих периодов</span>
                        <span>${assets.currentAssets.prepaidExpenses}</span>
                    </div>
                    <div class="balance-item">
                        <span>НДС по приобретенным товарам, работам, услугам</span>
                        <span>${assets.currentAssets.vat}</span>
                    </div>
                    <div class="balance-item">
                        <span>Краткосрочная дебиторская задолженность</span>
                        <span>${assets.currentAssets.receivables}</span>
                    </div>
                    <div class="balance-item">
                        <span>Денежные средства и их эквиваленты</span>
                        <span>${assets.currentAssets.cash}</span>
                    </div>
                    <div class="balance-total">
                        <span>ИТОГО по разделу II</span>
                        <span>${assets.currentAssets.total}</span>
                    </div>
                </div>
                
                <div class="balance-grand-total">
                    <span>БАЛАНС</span>
                    <span>${assets.totalAssets}</span>
                </div>
            </div>
            
            <div class="balance-section">
                <h4>СОБСТВЕННЫЙ КАПИТАЛ И ОБЯЗАТЕЛЬСТВА</h4>
                <div class="balance-group">
                    <h5>III. СОБСТВЕННЫЙ КАПИТАЛ</h5>
                    <div class="balance-item">
                        <span>Уставный капитал</span>
                        <span>${equity.shareCapital}</span>
                    </div>
                    <div class="balance-item">
                        <span>Добавочный капитал</span>
                        <span>${equity.additionalCapital}</span>
                    </div>
                    <div class="balance-item">
                        <span>Нераспределенная прибыль</span>
                        <span>${equity.retainedEarnings}</span>
                    </div>
                    <div class="balance-total">
                        <span>ИТОГО по разделу III</span>
                        <span>${equity.totalEquity}</span>
                    </div>
                </div>
                
                <div class="balance-group">
                    <h5>IV. ДОЛГОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА</h5>
                    <div class="balance-item">
                        <span>Долгосрочные кредиты и займы</span>
                        <span>${liabilities.nonCurrentLiabilities.longTermLoans}</span>
                    </div>
                    <div class="balance-item">
                        <span>Долгосрочные обязательства по лизинговым платежам</span>
                        <span>${liabilities.nonCurrentLiabilities.longTermLeaseObligations}</span>
                    </div>
                    <div class="balance-total">
                        <span>ИТОГО по разделу IV</span>
                        <span>${liabilities.nonCurrentLiabilities.total}</span>
                    </div>
                </div>
                
                <div class="balance-group">
                    <h5>V. КРАТКОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА</h5>
                    <div class="balance-item">
                        <span>Краткосрочные кредиты и займы</span>
                        <span>${liabilities.currentLiabilities.shortTermLoans}</span>
                    </div>
                    <div class="balance-item">
                        <span>Краткосрочная часть долгосрочных обязательств</span>
                        <span>${liabilities.currentLiabilities.shortTermPartOfLongTerm}</span>
                    </div>
                    <div class="balance-subgroup">
                        <div class="balance-item">
                            <span>Краткосрочная кредиторская задолженность - всего</span>
                            <span>${liabilities.currentLiabilities.payables.total}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>в том числе: поставщикам, подрядчикам</span>
                            <span>${liabilities.currentLiabilities.payables.suppliers}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>по налогам и сборам</span>
                            <span>${liabilities.currentLiabilities.payables.taxes}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>по социальному страхованию</span>
                            <span>${liabilities.currentLiabilities.payables.socialSecurity}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>по оплате труда</span>
                            <span>${liabilities.currentLiabilities.payables.wages}</span>
                        </div>
                        <div class="balance-subitem">
                            <span>по лизинговым платежам</span>
                            <span>${liabilities.currentLiabilities.payables.leasePayments}</span>
                        </div>
                    </div>
                    <div class="balance-item">
                        <span>Доходы будущих периодов</span>
                        <span>${liabilities.currentLiabilities.deferredIncome}</span>
                    </div>
                    <div class="balance-total">
                        <span>ИТОГО по разделу V</span>
                        <span>${liabilities.currentLiabilities.total}</span>
                    </div>
                </div>
                
                <div class="balance-grand-total">
                    <span>БАЛАНС</span>
                    <span>${assets.totalAssets}</span>
                </div>
            </div>
        </div>
    `
}

// Render income statement
function renderIncomeStatement(incomeStatement) {
  return `
        <div class="income-statement">
            <div class="income-item">
                <span>Выручка от реализации продукции, товаров, работ, услуг</span>
                <span>${incomeStatement.revenue}</span>
            </div>
            <div class="income-item">
                <span>Себестоимость реализованной продукции, товаров, работ, услуг</span>
                <span>(${incomeStatement.costOfSales})</span>
            </div>
            <div class="income-total">
                <span>Валовая прибыль</span>
                <span>${incomeStatement.grossProfit}</span>
            </div>
            <div class="income-item">
                <span>Управленческие расходы</span>
                <span>(${incomeStatement.managementExpenses})</span>
            </div>
            <div class="income-item">
                <span>Расходы на реализацию</span>
                <span>(${incomeStatement.salesExpenses})</span>
            </div>
            <div class="income-total">
                <span>Прибыль от реализации продукции, товаров, работ, услуг</span>
                <span>${incomeStatement.operatingProfit}</span>
            </div>
            <div class="income-item">
                <span>Прочие доходы по текущей деятельности</span>
                <span>${incomeStatement.otherOperatingIncome}</span>
            </div>
            <div class="income-item">
                <span>Прочие расходы по текущей деятельности</span>
                <span>(${incomeStatement.otherOperatingExpenses})</span>
            </div>
            <div class="income-total">
                <span>Прибыль от текущей деятельности</span>
                <span>${incomeStatement.profitFromCurrentActivity}</span>
            </div>
            
            <div class="income-group">
                <h5>Инвестиционная деятельность:</h5>
                <div class="income-subitem">
                    <span>Доходы по инвестиционной деятельности - всего</span>
                    <span>${incomeStatement.investmentIncome.total}</span>
                </div>
                <div class="income-subitem-detail">
                    <span>в том числе: доходы от выбытия основных средств</span>
                    <span>${incomeStatement.investmentIncome.assetDisposal}</span>
                </div>
                <div class="income-subitem-detail">
                    <span>прочие доходы по инвестиционной деятельности</span>
                    <span>${incomeStatement.investmentIncome.otherInvestmentIncome}</span>
                </div>
                <div class="income-subitem">
                    <span>Расходы по инвестиционной деятельности</span>
                    <span>(${incomeStatement.investmentExpenses.total})</span>
                </div>
            </div>
            
            <div class="income-group">
                <h5>Финансовая деятельность:</h5>
                <div class="income-subitem">
                    <span>Доходы по финансовой деятельности</span>
                    <span>${incomeStatement.financialIncome.total}</span>
                </div>
                <div class="income-subitem">
                    <span>Расходы по финансовой деятельности - всего</span>
                    <span>(${incomeStatement.financialExpenses.total})</span>
                </div>
                <div class="income-subitem-detail">
                    <span>в том числе: проценты к уплате</span>
                    <span>(${incomeStatement.financialExpenses.interestPayable})</span>
                </div>
                <div class="income-subitem-detail">
                    <span>курсовые разницы</span>
                    <span>(${incomeStatement.financialExpenses.currencyDifferences})</span>
                </div>
            </div>
            
            <div class="income-total">
                <span>Прибыль от инвестиционной и финансовой деятельности</span>
                <span>${incomeStatement.investmentAndFinancialResult}</span>
            </div>
            <div class="income-total">
                <span>Прибыль до налогообложения</span>
                <span>${incomeStatement.profitBeforeTax}</span>
            </div>
            <div class="income-grand-total">
                <span>Чистая прибыль</span>
                <span>${incomeStatement.netIncome}</span>
            </div>
            <div class="income-item">
                <span>Результат от переоценки долгосрочных активов</span>
                <span>${incomeStatement.revaluationResult}</span>
            </div>
            <div class="income-total">
                <span>Совокупная прибыль</span>
                <span>${incomeStatement.comprehensiveIncome}</span>
            </div>
            <div class="income-item">
                <span>Базовая прибыль на акцию</span>
                <span>${incomeStatement.basicEarningsPerShare}</span>
            </div>
        </div>
    `
}

// Render equity changes
function renderEquityChanges(equityChanges) {
  return `
        <div class="equity-changes">
            <div class="equity-section">
                <h5>Остаток на начало периода:</h5>
                <div class="equity-item">
                    <span>Уставный капитал</span>
                    <span>${equityChanges.beginningBalance.shareCapital}</span>
                </div>
                <div class="equity-item">
                    <span>Добавочный капитал</span>
                    <span>${equityChanges.beginningBalance.additionalCapital}</span>
                </div>
                <div class="equity-item">
                    <span>Нераспределенная прибыль</span>
                    <span>${equityChanges.beginningBalance.retainedEarnings}</span>
                </div>
                <div class="equity-total">
                    <span>Итого на начало периода</span>
                    <span>${equityChanges.beginningBalance.total}</span>
                </div>
            </div>
            
            <div class="equity-section">
                <h5>Увеличение собственного капитала:</h5>
                <div class="equity-item">
                    <span>Чистая прибыль</span>
                    <span>${equityChanges.increases.netIncome}</span>
                </div>
                <div class="equity-item">
                    <span>Переоценка долгосрочных активов</span>
                    <span>${equityChanges.increases.revaluation}</span>
                </div>
                <div class="equity-item">
                    <span>Увеличение уставного капитала</span>
                    <span>${equityChanges.increases.shareCapitalIncrease}</span>
                </div>
                <div class="equity-total">
                    <span>Всего увеличение</span>
                    <span>${equityChanges.increases.total}</span>
                </div>
            </div>
            
            <div class="equity-section">
                <h5>Остаток на конец периода:</h5>
                <div class="equity-item">
                    <span>Уставный капитал</span>
                    <span>${equityChanges.endingBalance.shareCapital}</span>
                </div>
                <div class="equity-item">
                    <span>Добавочный капитал</span>
                    <span>${equityChanges.endingBalance.additionalCapital}</span>
                </div>
                <div class="equity-item">
                    <span>Нераспределенная прибыль</span>
                    <span>${equityChanges.endingBalance.retainedEarnings}</span>
                </div>
                <div class="equity-grand-total">
                    <span>Итого на конец периода</span>
                    <span>${equityChanges.endingBalance.total}</span>
                </div>
            </div>
        </div>
    `
}

// Render cash flow
function renderCashFlow(cashFlow) {
  return `
        <div class="cash-flow">
            <div class="cash-section">
                <h5>Движение денежных средств по текущей деятельности:</h5>
                <div class="cash-group">
                    <div class="cash-item">
                        <span>Поступило денежных средств - всего</span>
                        <span>${cashFlow.operatingActivities.cashReceived.total}</span>
                    </div>
                    <div class="cash-subitem">
                        <span>от покупателей продукции</span>
                        <span>${cashFlow.operatingActivities.cashReceived.fromCustomers}</span>
                    </div>
                    <div class="cash-subitem">
                        <span>от покупателей материалов</span>
                        <span>${cashFlow.operatingActivities.cashReceived.fromMaterialSales}</span>
                    </div>
                    <div class="cash-subitem">
                        <span>прочие поступления</span>
                        <span>${cashFlow.operatingActivities.cashReceived.otherReceipts}</span>
                    </div>
                </div>
                <div class="cash-group">
                    <div class="cash-item">
                        <span>Направлено денежных средств - всего</span>
                        <span>(${cashFlow.operatingActivities.cashPaid.total})</span>
                    </div>
                    <div class="cash-subitem">
                        <span>на приобретение запасов</span>
                        <span>(${cashFlow.operatingActivities.cashPaid.forInventory})</span>
                    </div>
                    <div class="cash-subitem">
                        <span>на оплату труда</span>
                        <span>(${cashFlow.operatingActivities.cashPaid.forWages})</span>
                    </div>
                    <div class="cash-subitem">
                        <span>на уплату налогов и сборов</span>
                        <span>(${cashFlow.operatingActivities.cashPaid.forTaxes})</span>
                    </div>
                    <div class="cash-subitem">
                        <span>на прочие выплаты</span>
                        <span>(${cashFlow.operatingActivities.cashPaid.otherPayments})</span>
                    </div>
                </div>
                <div class="cash-total">
                    <span>Результат движения по текущей деятельности</span>
                    <span>${cashFlow.operatingActivities.netCashFromOperating}</span>
                </div>
            </div>
            
            <div class="cash-section">
                <h5>Движение денежных средств по инвестиционной деятельности:</h5>
                <div class="cash-item">
                    <span>Поступило денежных средств</span>
                    <span>${cashFlow.investingActivities.cashReceived.total}</span>
                </div>
                <div class="cash-item">
                    <span>Направлено денежных средств</span>
                    <span>(${cashFlow.investingActivities.cashPaid.total})</span>
                </div>
                <div class="cash-total">
                    <span>Результат движения по инвестиционной деятельности</span>
                    <span>${cashFlow.investingActivities.netCashFromInvesting}</span>
                </div>
            </div>
            
            <div class="cash-section">
                <h5>Движение денежных средств по финансовой деятельности:</h5>
                <div class="cash-item">
                    <span>Поступило денежных средств - всего</span>
                    <span>${cashFlow.financingActivities.cashReceived.total}</span>
                </div>
                <div class="cash-subitem">
                    <span>кредиты и займы</span>
                    <span>${cashFlow.financingActivities.cashReceived.loansReceived}</span>
                </div>
                <div class="cash-item">
                    <span>Направлено денежных средств - всего</span>
                    <span>(${cashFlow.financingActivities.cashPaid.total})</span>
                </div>
                <div class="cash-subitem">
                    <span>на погашение кредитов и займов</span>
                    <span>(${cashFlow.financingActivities.cashPaid.loanRepayments})</span>
                </div>
                <div class="cash-subitem">
                    <span>на выплаты процентов</span>
                    <span>(${cashFlow.financingActivities.cashPaid.interestPaid})</span>
                </div>
                <div class="cash-subitem">
                    <span>на лизинговые платежи</span>
                    <span>(${cashFlow.financingActivities.cashPaid.leasePayments})</span>
                </div>
                <div class="cash-total">
                    <span>Результат движения по финансовой деятельности</span>
                    <span>${cashFlow.financingActivities.netCashFromFinancing}</span>
                </div>
            </div>
            
            <div class="cash-summary">
                <div class="cash-grand-total">
                    <span>Результат движения денежных средств</span>
                    <span>${cashFlow.netCashFlow}</span>
                </div>
                <div class="cash-item">
                    <span>Остаток денежных средств на начало периода</span>
                    <span>${cashFlow.cashAtBeginning}</span>
                </div>
                <div class="cash-grand-total">
                    <span>Остаток денежных средств на конец периода</span>
                    <span>${cashFlow.cashAtEnd}</span>
                </div>
            </div>
        </div>
    `
}

// Render company info
function renderCompanyInfo(companyInfo) {
  if (!companyInfo) return '<div class="no-data"><p>Информация о компании недоступна</p></div>'

  return `
        <div class="company-info">
            <div class="info-section">
                <h5>Общая информация</h5>
                <div class="info-grid">
                    <div class="info-item">
                        <span>Среднесписочная численность работников</span>
                        <span>${companyInfo.employees} человек</span>
                    </div>
                    <div class="info-item">
                        <span>Общее количество акционеров</span>
                        <span>${companyInfo.shareholders.total}</span>
                    </div>
                    <div class="info-item">
                        <span>из них: юридических лиц</span>
                        <span>${companyInfo.shareholders.legal}</span>
                    </div>
                    <div class="info-item">
                        <span>физических лиц</span>
                        <span>${companyInfo.shareholders.individual}</span>
                    </div>
                    <div class="info-item">
                        <span>нерезидентов</span>
                        <span>${companyInfo.shareholders.nonResidents}</span>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h5>Структура собственности</h5>
                <div class="info-grid">
                    <div class="info-item">
                        <span>Доля государства в уставном фонде</span>
                        <span>${companyInfo.ownership.stateShare}</span>
                    </div>
                    <div class="info-item">
                        <span>Коммунальная собственность - всего</span>
                        <span>${companyInfo.ownership.communal.total.shares} акций (${companyInfo.ownership.communal.total.percentage})</span>
                    </div>
                    <div class="info-item">
                        <span>в том числе: районная</span>
                        <span>${companyInfo.ownership.communal.district.shares} акций (${companyInfo.ownership.communal.district.percentage})</span>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h5>Основные виды продукции</h5>
                <div class="products-list">
                    ${companyInfo.mainProducts
                      .map(
                        (product) => `
                        <div class="product-item">
                            <span>${product.name}</span>
                            <span>${product.revenue} (${product.share})</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="info-section">
                <h5>Информация о дивидендах</h5>
                <div class="info-grid">
                    <div class="info-item">
                        <span>Начислено на выплату дивидендов</span>
                        <span>${companyInfo.dividends.declared2024}</span>
                    </div>
                    <div class="info-item">
                        <span>Фактически выплаченные дивиденды</span>
                        <span>${companyInfo.dividends.paid2024}</span>
                    </div>
                    <div class="info-item">
                        <span>Дивиденды на 1 акцию</span>
                        <span>${companyInfo.dividends.perShareDeclared}</span>
                    </div>
                    <div class="info-item">
                        <span>Обеспеченность акции имуществом</span>
                        <span>${companyInfo.shareInfo.assetBackingPerShare}</span>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h5>Корпоративное управление</h5>
                <div class="info-item">
                    <span>Официальный сайт</span>
                    <span><a href="http://${companyInfo.governance.website}" target="_blank">${companyInfo.governance.website}</a></span>
                </div>
                <div class="info-item">
                    <span>Дата проведения годового собрания акционеров</span>
                    <span>${companyInfo.governance.annualMeetingDate}</span>
                </div>
                <div class="governance-text">
                    <p>${companyInfo.governance.corporateGovernance}</p>
                </div>
            </div>
            
            <div class="info-section">
                <h5>Руководство</h5>
                <div class="info-grid">
                    <div class="info-item">
                        <span>Руководитель</span>
                        <span>${companyInfo.management.director}</span>
                    </div>
                    <div class="info-item">
                        <span>Главный бухгалтер</span>
                        <span>${companyInfo.management.deputyChiefAccountant}</span>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Toggle accordion
function toggleAccordion(id) {
  const content = document.getElementById(`${id}-content`)
  const header = content.previousElementSibling
  const icon = header.querySelector(".accordion-icon")

  if (content.classList.contains("active")) {
    content.classList.remove("active")
    icon.style.transform = "rotate(0deg)"
  } else {
    // Close all other accordions
    document.querySelectorAll(".accordion-content").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelectorAll(".accordion-icon").forEach((item) => {
      item.style.transform = "rotate(0deg)"
    })

    // Open clicked accordion
    content.classList.add("active")
    icon.style.transform = "rotate(180deg)"
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", loadShareholdersData)
