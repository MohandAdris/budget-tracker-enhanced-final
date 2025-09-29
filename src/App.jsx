import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, Calculator, DollarSign, TrendingUp, PieChart, Edit, FileText, Download, Settings, History, Blocks, Save } from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import './App.css'

const EXPENSE_CATEGORIES = [
  'Video Production',
  'Creative Services', 
  'Equipment Rental',
  'Software & Licenses',
  'Talent & Crew',
  'Location & Studio',
  'Post-Production',
  'Marketing & Advertising',
  'Travel & Transportation',
  'Client Entertainment',
  'Other'
]

const DEFAULT_EXPENSE_BLOCKS = [
  {
    id: 1,
    name: 'Video Shooting',
    category: 'Video Production',
    description: 'Professional video shooting service',
    tiers: [
      { range: '1-3', price: 400, label: '1-3 videos' },
      { range: '4+', price: 300, label: '4+ videos each' }
    ]
  },
  {
    id: 2,
    name: 'Video Editing',
    category: 'Post-Production',
    description: 'Professional video editing and post-production',
    tiers: [
      { range: '1-3', price: 400, label: '1-3 videos' },
      { range: '4+', price: 300, label: '4+ videos each' }
    ]
  },
  {
    id: 3,
    name: 'Social Media Post',
    category: 'Marketing & Advertising',
    description: 'Social media content creation',
    tiers: [
      { range: '1-3', price: 70, label: '1-3 posts' },
      { range: '4+', price: 50, label: '4+ posts each' }
    ]
  },
  {
    id: 4,
    name: 'Branding Package',
    category: 'Creative Services',
    description: 'Complete branding solution',
    tiers: [
      { range: 'low', price: 2500, label: 'Basic Package' },
      { range: 'mid', price: 3500, label: 'Standard Package' },
      { range: 'high', price: 7500, label: 'Premium Package (₪5000-₪10000)' }
    ]
  },
  {
    id: 5,
    name: 'Photography Session',
    category: 'Creative Services',
    description: 'Professional photography service',
    tiers: [
      { range: '1-2', price: 500, label: '1-2 hours' },
      { range: '3-5', price: 400, label: '3-5 hours per hour' },
      { range: '6+', price: 350, label: '6+ hours per hour' }
    ]
  },
  {
    id: 6,
    name: 'Motion Graphics',
    category: 'Post-Production',
    description: 'Animated graphics and visual effects',
    tiers: [
      { range: 'simple', price: 300, label: 'Simple Animation' },
      { range: 'complex', price: 600, label: 'Complex Animation' },
      { range: 'premium', price: 1200, label: 'Premium Effects' }
    ]
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

function App() {
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(0)
  const [budgetInput, setBudgetInput] = useState('')
  const [projectDuration, setProjectDuration] = useState(1)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseBlocks] = useState(DEFAULT_EXPENSE_BLOCKS)
  const [reportHistory, setReportHistory] = useState([])
  const [activeTab, setActiveTab] = useState('tracker')
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [blockQuantity, setBlockQuantity] = useState(1)
  const [selectedTier, setSelectedTier] = useState('')
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    file: null
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    const savedBudget = localStorage.getItem('budget')
    const savedDuration = localStorage.getItem('projectDuration')
    const savedHistory = localStorage.getItem('reportHistory')
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    if (savedBudget) {
      setBudget(parseFloat(savedBudget))
    }
    if (savedDuration) {
      setProjectDuration(parseInt(savedDuration))
    }
    if (savedHistory) {
      setReportHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('budget', budget.toString())
  }, [budget])

  useEffect(() => {
    localStorage.setItem('projectDuration', projectDuration.toString())
  }, [projectDuration])

  useEffect(() => {
    localStorage.setItem('reportHistory', JSON.stringify(reportHistory))
  }, [reportHistory])

  const handleSetBudget = () => {
    const budgetValue = parseFloat(budgetInput)
    if (!isNaN(budgetValue) && budgetValue > 0) {
      setBudget(budgetValue)
      setBudgetInput('')
    }
  }

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.category && newExpense.amount && newExpense.date) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        file: newExpense.file
      }
      setExpenses([...expenses, expense])
      setNewExpense({
        name: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        file: null
      })
    }
  }

  const handleAddBlockExpense = () => {
    if (selectedBlock && selectedTier && blockQuantity > 0) {
      const tier = selectedBlock.tiers.find(t => t.range === selectedTier)
      if (tier) {
        const totalAmount = tier.price * blockQuantity
        const expense = {
          id: Date.now(),
          name: `${selectedBlock.name} (${tier.label}) x${blockQuantity}`,
          category: selectedBlock.category,
          amount: totalAmount,
          date: new Date().toISOString().split('T')[0],
          file: null,
          isFromBlock: true,
          blockId: selectedBlock.id
        }
        setExpenses([...expenses, expense])
        setShowBlockDialog(false)
        setSelectedBlock(null)
        setSelectedTier('')
        setBlockQuantity(1)
      }
    }
  }

  const handleEditExpense = (expense) => {
    setEditingExpense({
      ...expense,
      amount: expense.amount.toString()
    })
  }

  const handleUpdateExpense = () => {
    if (editingExpense.name && editingExpense.category && editingExpense.amount && editingExpense.date) {
      const updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id
          ? {
              ...editingExpense,
              amount: parseFloat(editingExpense.amount)
            }
          : expense
      )
      setExpenses(updatedExpenses)
      setEditingExpense(null)
    }
  }

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const generatePDF = () => {
    const printWindow = window.open('', '_blank')
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const budgetVariance = budget - totalExpenses
    const totalProjectExpenses = totalExpenses * projectDuration
    const totalProjectRevenue = budget * projectDuration
    const totalProfit = totalProjectRevenue - totalProjectExpenses

    printWindow.document.write(`
      <html>
        <head>
          <title>Creative Project Budget Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .positive { color: green; }
            .negative { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Creative Project Budget Summary</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h2>Project Overview</h2>
            <p><strong>Monthly Client Payment:</strong> ₪${budget.toFixed(2)}</p>
            <p><strong>Project Duration:</strong> ${projectDuration} month(s)</p>
            <p><strong>Total Client Payment:</strong> ₪${totalProjectRevenue.toFixed(2)}</p>
          </div>

          <div class="summary">
            <h2>Financial Summary</h2>
            <p><strong>Monthly Expenses:</strong> ₪${totalExpenses.toFixed(2)}</p>
            <p><strong>Monthly Profit:</strong> <span class="${budgetVariance >= 0 ? 'positive' : 'negative'}">₪${budgetVariance.toFixed(2)}</span></p>
            <p><strong>Total Project Expenses:</strong> ₪${totalProjectExpenses.toFixed(2)}</p>
            <p><strong>Total Project Profit:</strong> <span class="${totalProfit >= 0 ? 'positive' : 'negative'}">₪${totalProfit.toFixed(2)}</span></p>
          </div>

          <h2>Expense Details</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(expense => `
                <tr>
                  <td>${new Date(expense.date).toLocaleDateString()}</td>
                  <td>${expense.name}</td>
                  <td>${expense.category}</td>
                  <td>₪${expense.amount.toFixed(2)}</td>
                  <td>${expense.isFromBlock ? 'Block' : 'Manual'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const saveReport = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const budgetVariance = budget - totalExpenses
    const totalProjectExpenses = totalExpenses * projectDuration
    const totalProjectRevenue = budget * projectDuration
    const totalProfit = totalProjectRevenue - totalProjectExpenses

    const report = {
      id: Date.now(),
      date: new Date().toISOString(),
      projectDuration,
      budget,
      totalExpenses,
      budgetVariance,
      totalProjectRevenue,
      totalProjectExpenses,
      totalProfit,
      expenseCount: expenses.length,
      expenses: [...expenses]
    }

    setReportHistory([report, ...reportHistory])
  }

  const loadReport = (report) => {
    setBudget(report.budget)
    setProjectDuration(report.projectDuration)
    setExpenses(report.expenses)
    setActiveTab('tracker')
  }

  const deleteReport = (id) => {
    setReportHistory(reportHistory.filter(report => report.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetVariance = budget - totalExpenses
  const budgetUsage = budget > 0 ? (totalExpenses / budget) * 100 : 0

  // Project statistics - Budget is what client pays us (our revenue)
  const totalProjectExpenses = totalExpenses * projectDuration
  const totalProjectRevenue = budget * projectDuration
  const totalProfit = totalProjectRevenue - totalProjectExpenses

  const expensesByCategory = EXPENSE_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return total > 0 ? { name: category, value: total } : null
  }).filter(Boolean)

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const existing = acc.find(item => item.month === month)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({ month, amount: expense.amount })
    }
    return acc
  }, []).sort((a, b) => new Date(a.month) - new Date(b.month))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-blue-600" />
            Creative Project Budget Tracker
          </h1>
          <p className="text-gray-600 text-lg">Manage budgets for marketing campaigns, video productions, and creative projects</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Budget Tracker
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Report History
            </TabsTrigger>
          </TabsList>

          {/* Budget Tracker Tab */}
          <TabsContent value="tracker">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Settings */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Project Settings
                    </CardTitle>
                    <CardDescription>Configure your project parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">Monthly Client Payment (₪)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="budget"
                            type="number"
                            placeholder="What client pays per month"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleSetBudget} className="bg-blue-600 hover:bg-blue-700">
                            Set Payment
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="duration">Project Duration (months)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={projectDuration}
                          onChange={(e) => setProjectDuration(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Blocks */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Blocks className="h-5 w-5 text-purple-600" />
                      Quick Expense Blocks
                    </CardTitle>
                    <CardDescription>Add common expenses with predefined pricing tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {expenseBlocks.map((block) => (
                        <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                              onClick={() => {
                                setSelectedBlock(block)
                                setShowBlockDialog(true)
                              }}>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{block.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{block.description}</p>
                            <Badge variant="secondary" className="mb-2">{block.category}</Badge>
                            <div className="space-y-1">
                              {block.tiers.map((tier, index) => (
                                <div key={index} className="text-xs text-gray-500">
                                  {tier.label}: ₪{tier.price}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Expense */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-blue-600" />
                      Add Custom Expense
                    </CardTitle>
                    <CardDescription>Record a custom expense not covered by blocks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Expense name"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                      />
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddExpense} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Expense
                    </Button>
                  </CardContent>
                </Card>

                {/* Expense List */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Expense List</CardTitle>
                    <CardDescription>All recorded expenses for this campaign/project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expenses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No expenses recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  EXPENSE_CATEGORIES.indexOf(expense.category) % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {expense.category}
                                </span>
                                {expense.isFromBlock && (
                                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                                    Block
                                  </Badge>
                                )}
                                <h3 className="font-semibold text-gray-900">{expense.name}</h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg text-gray-900">₪{expense.amount.toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExpense(expense)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Financial Summary */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Client Payment:</span>
                        <span className="font-semibold text-lg">₪{budget.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Expenses:</span>
                        <span className="font-semibold text-lg">₪{totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Profit:</span>
                          <span className={`font-semibold text-lg ${budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₪{budgetVariance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Budget Progress Bar */}
                    {budget > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Budget Usage</span>
                          <span>{budgetUsage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              budgetUsage > 100 ? 'bg-red-500' : 
                              budgetUsage > 50 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Project Statistics */}
                    {projectDuration > 1 && (
                      <div className="border-t pt-3 mt-4">
                        <h4 className="font-semibold mb-2">Project Statistics ({projectDuration} months)</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Client Payment:</span>
                            <span>₪{totalProjectRevenue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Expenses:</span>
                            <span>₪{totalProjectExpenses.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-600">Total Profit:</span>
                            <span className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                              ₪{totalProfit.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={generatePDF} className="flex-1" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button onClick={saveReport} className="flex-1" variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                {expensesByCategory.length > 0 && (
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-600" />
                        Expenses by Category
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={expensesByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {expensesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`₪${value.toFixed(2)}`, 'Amount']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Admin Dashboard Tab */}
          <TabsContent value="admin">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>Manage expense blocks and system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Admin Features Coming Soon</h3>
                  <p className="text-gray-600">Block management and advanced settings will be available in the next update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-green-600" />
                  Report History
                </CardTitle>
                <CardDescription>View and manage saved project reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reportHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved reports yet</p>
                    <p className="text-sm mt-2">Use the "Save Report" button in the Budget Tracker to create your first report</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportHistory.map((report) => (
                      <Card key={report.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                Report - {new Date(report.date).toLocaleDateString()}
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                                <div>
                                  <span className="text-gray-600">Duration:</span>
                                  <p className="font-semibold">{report.projectDuration} months</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Client Payment:</span>
                                  <p className="font-semibold">₪{report.budget.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total Expenses:</span>
                                  <p className="font-semibold">₪{report.totalExpenses.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total Profit:</span>
                                  <p className={`font-semibold ${report.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₪{report.totalProfit.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2">{report.expenseCount} expenses recorded</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => loadReport(report)}
                              >
                                Load
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteReport(report.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Block Selection Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedBlock?.name}</DialogTitle>
            <DialogDescription>{selectedBlock?.description}</DialogDescription>
          </DialogHeader>
          {selectedBlock && (
            <div className="space-y-4">
              <div>
                <Label>Select Pricing Tier</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose pricing tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBlock.tiers.map((tier) => (
                      <SelectItem key={tier.range} value={tier.range}>
                        {tier.label} - ₪{tier.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={blockQuantity}
                  onChange={(e) => setBlockQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              {selectedTier && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Cost:</p>
                  <p className="text-lg font-semibold text-green-600">
                    ₪{(selectedBlock.tiers.find(t => t.range === selectedTier)?.price * blockQuantity || 0).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleAddBlockExpense} className="flex-1" disabled={!selectedTier}>
                  Add Expense
                </Button>
                <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details</DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Expense Name</Label>
                <Input
                  id="edit-name"
                  value={editingExpense.name}
                  onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editingExpense.category} onValueChange={(value) => setEditingExpense({ ...editingExpense, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount (₪)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateExpense} className="flex-1">
                  Update Expense
                </Button>
                <Button variant="outline" onClick={() => setEditingExpense(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
