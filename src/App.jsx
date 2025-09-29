import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Switch } from './components/ui/switch';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calculator, Settings, History, Plus, Edit, Trash2, Download, Upload, BarChart3, PieChart as PieChartIcon, TrendingUp, Users, DollarSign, Calendar, FileText, Database, Shield, Bell, Palette, Globe, Zap, Target, Award, Clock, Filter, Search, RefreshCw, Save, Copy, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Info, Star, Heart, Bookmark, Share2, Mail, Phone, MapPin, Camera, Video, Mic, Image, File, Link, Tag, Flag, Archive, Trash, Lock, Unlock, Home, Building, Briefcase, CreditCard, ShoppingCart, Package, Truck, Plane, Car, Train, Bus, Bike, Walk } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DEFAULT_EXPENSE_BLOCKS = [
  {
    id: 1,
    name: 'Video Shooting',
    description: 'Professional video shooting service',
    category: 'Video Production',
    icon: 'Video',
    color: '#3B82F6',
    pricingTiers: [
      { range: '1-3 videos', price: 400, type: 'fixed' },
      { range: '4+ videos each', price: 300, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['video', 'production', 'shooting'],
    estimatedDuration: '4-8 hours',
    requirements: 'Camera equipment, lighting setup'
  },
  {
    id: 2,
    name: 'Video Editing',
    description: 'Professional video editing and post-production',
    category: 'Post-Production',
    icon: 'Edit',
    color: '#10B981',
    pricingTiers: [
      { range: '1-3 videos', price: 400, type: 'fixed' },
      { range: '4+ videos each', price: 300, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['editing', 'post-production', 'video'],
    estimatedDuration: '2-6 hours per video',
    requirements: 'Editing software, raw footage'
  },
  {
    id: 3,
    name: 'Social Media Post',
    description: 'Social media content creation',
    category: 'Marketing & Advertising',
    icon: 'Share2',
    color: '#F59E0B',
    pricingTiers: [
      { range: '1-3 posts', price: 70, type: 'fixed' },
      { range: '4+ posts each', price: 50, type: 'per_item' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['social media', 'content', 'marketing'],
    estimatedDuration: '1-2 hours per post',
    requirements: 'Design software, brand guidelines'
  },
  {
    id: 4,
    name: 'Branding Package',
    description: 'Complete branding solution',
    category: 'Creative Services',
    icon: 'Palette',
    color: '#8B5CF6',
    pricingTiers: [
      { range: 'Basic Package', price: 2500, type: 'package' },
      { range: 'Standard Package', price: 3500, type: 'package' },
      { range: 'Premium Package', price: 7500, type: 'package' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['branding', 'logo', 'identity'],
    estimatedDuration: '2-4 weeks',
    requirements: 'Brand strategy, design concepts'
  },
  {
    id: 5,
    name: 'Photography Session',
    description: 'Professional photography service',
    category: 'Creative Services',
    icon: 'Camera',
    color: '#EF4444',
    pricingTiers: [
      { range: '1-2 hours', price: 500, type: 'hourly' },
      { range: '3-5 hours per hour', price: 400, type: 'hourly' },
      { range: '6+ hours per hour', price: 350, type: 'hourly' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['photography', 'photoshoot', 'images'],
    estimatedDuration: 'Variable',
    requirements: 'Camera equipment, lighting'
  },
  {
    id: 6,
    name: 'Motion Graphics',
    description: 'Animated graphics and visual effects',
    category: 'Post-Production',
    icon: 'Zap',
    color: '#06B6D4',
    pricingTiers: [
      { range: 'Simple Animation', price: 300, type: 'complexity' },
      { range: 'Complex Animation', price: 600, type: 'complexity' },
      { range: 'Premium Effects', price: 1200, type: 'complexity' }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: ['animation', 'motion graphics', 'effects'],
    estimatedDuration: '1-3 days',
    requirements: 'Animation software, design assets'
  }
];

const CATEGORIES = [
  'Video Production',
  'Post-Production', 
  'Creative Services',
  'Marketing & Advertising',
  'Equipment Rental',
  'Software & Licenses',
  'Talent & Crew',
  'Location & Studio',
  'Travel & Transportation',
  'Client Entertainment',
  'Consulting',
  'Training & Education',
  'Legal & Contracts',
  'Insurance',
  'Miscellaneous'
];

function App() {
  // Core State
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [projectDuration, setProjectDuration] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [expenseBlocks, setExpenseBlocks] = useState(DEFAULT_EXPENSE_BLOCKS);
  const [reportHistory, setReportHistory] = useState([]);
  
  // Admin Dashboard State
  const [editingBlock, setEditingBlock] = useState(null);
  const [isCreateBlockOpen, setIsCreateBlockOpen] = useState(false);
  const [isEditBlockOpen, setIsEditBlockOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState({
    currency: '₪',
    language: 'en',
    theme: 'light',
    notifications: true,
    autoSave: true,
    backupEnabled: true,
    exportFormat: 'pdf',
    defaultCategory: 'Creative Services',
    taxRate: 17,
    profitMargin: 20,
    workingHours: 8,
    overtimeRate: 1.5
  });
  
  // Form State
  const [newBlock, setNewBlock] = useState({
    name: '',
    description: '',
    category: 'Creative Services',
    icon: 'Star',
    color: '#3B82F6',
    pricingTiers: [{ range: '', price: 0, type: 'fixed' }],
    isActive: true,
    tags: [],
    estimatedDuration: '',
    requirements: ''
  });
  
  const [customExpense, setCustomExpense] = useState({
    name: '',
    amount: '',
    category: 'Creative Services',
    date: new Date().toISOString().split('T')[0],
    description: '',
    attachments: []
  });

  // Load data from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    const savedDuration = localStorage.getItem('projectDuration');
    const savedExpenses = localStorage.getItem('expenses');
    const savedBlocks = localStorage.getItem('expenseBlocks');
    const savedReports = localStorage.getItem('reportHistory');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));
    if (savedDuration) setProjectDuration(parseInt(savedDuration));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBlocks) setExpenseBlocks(JSON.parse(savedBlocks));
    if (savedReports) setReportHistory(JSON.parse(savedReports));
    if (savedSettings) setSettings({ ...settings, ...JSON.parse(savedSettings) });
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    localStorage.setItem('projectDuration', projectDuration.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('expenseBlocks', JSON.stringify(expenseBlocks));
    localStorage.setItem('reportHistory', JSON.stringify(reportHistory));
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [monthlyBudget, projectDuration, expenses, expenseBlocks, reportHistory, settings]);

  // Calculations
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyProfit = monthlyBudget - totalMonthlyExpenses;
  const totalProjectBudget = monthlyBudget * projectDuration;
  const totalProjectExpenses = totalMonthlyExpenses * projectDuration;
  const totalProjectProfit = totalProjectBudget - totalProjectExpenses;
  const budgetUsagePercentage = monthlyBudget > 0 ? (totalMonthlyExpenses / monthlyBudget) * 100 : 0;

  // Admin Functions
  const handleCreateBlock = () => {
    const block = {
      ...newBlock,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      tags: typeof newBlock.tags === 'string' ? newBlock.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : newBlock.tags
    };
    setExpenseBlocks([...expenseBlocks, block]);
    setNewBlock({
      name: '',
      description: '',
      category: 'Creative Services',
      icon: 'Star',
      color: '#3B82F6',
      pricingTiers: [{ range: '', price: 0, type: 'fixed' }],
      isActive: true,
      tags: [],
      estimatedDuration: '',
      requirements: ''
    });
    setIsCreateBlockOpen(false);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setNewBlock({ ...block });
    setIsEditBlockOpen(true);
  };

  const handleUpdateBlock = () => {
    setExpenseBlocks(expenseBlocks.map(block => 
      block.id === editingBlock.id ? { ...newBlock, id: editingBlock.id } : block
    ));
    setIsEditBlockOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (blockId) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      setExpenseBlocks(expenseBlocks.filter(block => block.id !== blockId));
    }
  };

  const handleToggleBlockStatus = (blockId) => {
    setExpenseBlocks(expenseBlocks.map(block =>
      block.id === blockId ? { ...block, isActive: !block.isActive } : block
    ));
  };

  const handleDuplicateBlock = (block) => {
    const duplicatedBlock = {
      ...block,
      id: Date.now(),
      name: `${block.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setExpenseBlocks([...expenseBlocks, duplicatedBlock]);
  };

  const handleBulkAction = () => {
    if (bulkAction === 'delete') {
      if (window.confirm(`Delete ${selectedBlocks.length} selected blocks?`)) {
        setExpenseBlocks(expenseBlocks.filter(block => !selectedBlocks.includes(block.id)));
        setSelectedBlocks([]);
      }
    } else if (bulkAction === 'activate') {
      setExpenseBlocks(expenseBlocks.map(block =>
        selectedBlocks.includes(block.id) ? { ...block, isActive: true } : block
      ));
      setSelectedBlocks([]);
    } else if (bulkAction === 'deactivate') {
      setExpenseBlocks(expenseBlocks.map(block =>
        selectedBlocks.includes(block.id) ? { ...block, isActive: false } : block
      ));
      setSelectedBlocks([]);
    }
    setBulkAction('');
  };

  const handleExportData = (format) => {
    const data = {
      expenseBlocks,
      expenses,
      settings,
      reportHistory,
      exportDate: new Date().toISOString()
    };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.expenseBlocks) setExpenseBlocks(data.expenseBlocks);
          if (data.expenses) setExpenses(data.expenses);
          if (data.settings) setSettings({ ...settings, ...data.settings });
          if (data.reportHistory) setReportHistory(data.reportHistory);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all blocks to defaults? This will remove all custom blocks.')) {
      setExpenseBlocks(DEFAULT_EXPENSE_BLOCKS);
    }
  };

  // Filter and sort blocks
  const filteredBlocks = expenseBlocks
    .filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (block.tags && block.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = filterCategory === 'all' || block.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'category': return a.category.localeCompare(b.category);
        case 'created': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price': return (a.pricingTiers[0]?.price || 0) - (b.pricingTiers[0]?.price || 0);
        default: return 0;
      }
    });

  // Analytics data
  const categoryData = CATEGORIES.map(category => ({
    name: category,
    value: expenseBlocks.filter(block => block.category === category).length,
    expenses: expenses.filter(expense => expense.category === category).length
  })).filter(item => item.value > 0);

  // Add expense from block
  const addExpenseFromBlock = (block, tierIndex, quantity = 1) => {
    const tier = block.pricingTiers[tierIndex];
    const totalAmount = tier.price * quantity;
    
    const expense = {
      id: Date.now(),
      name: `${block.name} - ${tier.range}`,
      amount: totalAmount,
      category: block.category,
      date: new Date().toISOString().split('T')[0],
      description: `${block.description} (${quantity}x ${tier.range})`,
      blockId: block.id,
      tierIndex,
      quantity
    };
    
    setExpenses([...expenses, expense]);
  };

  // Add custom expense
  const addCustomExpense = () => {
    if (customExpense.name && customExpense.amount) {
      const expense = {
        id: Date.now(),
        ...customExpense,
        amount: parseFloat(customExpense.amount)
      };
      setExpenses([...expenses, expense]);
      setCustomExpense({
        name: '',
        amount: '',
        category: 'Creative Services',
        date: new Date().toISOString().split('T')[0],
        description: '',
        attachments: []
      });
    }
  };

  // Generate PDF Report
  const generatePDF = () => {
    const reportContent = `
      <html>
        <head>
          <title>Creative Project Budget Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .financial-summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .positive { color: green; }
            .negative { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Creative Project Budget Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2>Project Overview</h2>
            <p><strong>Monthly Client Payment:</strong> ${settings.currency}${monthlyBudget.toFixed(2)}</p>
            <p><strong>Project Duration:</strong> ${projectDuration} months</p>
            <p><strong>Total Project Budget:</strong> ${settings.currency}${totalProjectBudget.toFixed(2)}</p>
          </div>
          
          <div class="financial-summary">
            <h2>Financial Summary</h2>
            <p><strong>Monthly Expenses:</strong> ${settings.currency}${totalMonthlyExpenses.toFixed(2)}</p>
            <p><strong>Monthly Profit:</strong> <span class="${monthlyProfit >= 0 ? 'positive' : 'negative'}">${settings.currency}${monthlyProfit.toFixed(2)}</span></p>
            <p><strong>Total Project Expenses:</strong> ${settings.currency}${totalProjectExpenses.toFixed(2)}</p>
            <p><strong>Total Project Profit:</strong> <span class="${totalProjectProfit >= 0 ? 'positive' : 'negative'}">${settings.currency}${totalProjectProfit.toFixed(2)}</span></p>
          </div>
          
          <div class="section">
            <h2>Expense Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map(expense => `
                  <tr>
                    <td>${expense.date}</td>
                    <td>${expense.name}</td>
                    <td>${expense.category}</td>
                    <td>${settings.currency}${expense.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(reportContent);
    newWindow.document.close();
    newWindow.print();
  };

  // Save Report
  const saveReport = () => {
    const report = {
      id: Date.now(),
      name: `Report ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      monthlyBudget,
      projectDuration,
      expenses: [...expenses],
      totalMonthlyExpenses,
      monthlyProfit,
      totalProjectProfit
    };
    setReportHistory([report, ...reportHistory]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Creative Project Budget Tracker</h1>
          </div>
          <p className="text-gray-600">Manage budgets for marketing campaigns, video productions, and creative projects</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="budget" className="flex items-center gap-2">
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
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Project Settings
                  </CardTitle>
                  <CardDescription>Configure your project parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Monthly Client Payment ({settings.currency})</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                        placeholder="What client pays per month"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Project Duration (months)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Client Payment</p>
                      <p className="text-2xl font-bold text-blue-600">{settings.currency}{monthlyBudget.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Expenses</p>
                      <p className="text-2xl font-bold text-red-600">{settings.currency}{totalMonthlyExpenses.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly Profit</p>
                      <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {settings.currency}{monthlyProfit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Budget Usage</p>
                      <p className="text-2xl font-bold text-gray-900">{budgetUsagePercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Usage</span>
                      <span>{budgetUsagePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={budgetUsagePercentage} 
                      className={`h-3 ${budgetUsagePercentage >= 50 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={generatePDF} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button onClick={saveReport} variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Expense Blocks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Quick Expense Blocks
                </CardTitle>
                <CardDescription>Add common expenses with predefined pricing tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expenseBlocks.filter(block => block.isActive).map((block) => (
                    <Card key={block.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{block.name}</CardTitle>
                          <Badge variant="secondary" style={{ backgroundColor: block.color + '20', color: block.color }}>
                            {block.category}
                          </Badge>
                        </div>
                        <CardDescription>{block.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {block.pricingTiers.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">{tier.range}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{settings.currency}{tier.price}</span>
                                <Button 
                                  size="sm" 
                                  onClick={() => addExpenseFromBlock(block, index)}
                                  className="h-6 px-2"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add Custom Expense
                </CardTitle>
                <CardDescription>Record a custom expense not covered by blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Expense name"
                    value={customExpense.name}
                    onChange={(e) => setCustomExpense({...customExpense, name: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={customExpense.amount}
                    onChange={(e) => setCustomExpense({...customExpense, amount: e.target.value})}
                  />
                  <Select value={customExpense.category} onValueChange={(value) => setCustomExpense({...customExpense, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addCustomExpense}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Expense
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expense List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Expense List
                </CardTitle>
                <CardDescription>All recorded expenses for this campaign/project</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{expense.name}</h4>
                            <Badge variant="outline">{expense.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{expense.date}</p>
                          {expense.description && (
                            <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{settings.currency}{expense.amount.toFixed(2)}</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
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
          </TabsContent>

          {/* Admin Dashboard Tab */}
          <TabsContent value="admin" className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                      <p className="text-2xl font-bold">{expenseBlocks.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Blocks</p>
                      <p className="text-2xl font-bold">{expenseBlocks.filter(b => b.isActive).length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold">{expenses.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold">{new Set(expenseBlocks.map(b => b.category)).size}</p>
                    </div>
                    <Tag className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Block Management Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Block Management
                </CardTitle>
                <CardDescription>Create, edit, and manage expense blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Dialog open={isCreateBlockOpen} onOpenChange={setIsCreateBlockOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Block
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Expense Block</DialogTitle>
                        <DialogDescription>
                          Add a new expense block with custom pricing tiers
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="blockName">Block Name</Label>
                            <Input
                              id="blockName"
                              value={newBlock.name}
                              onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
                              placeholder="e.g., Video Shooting"
                            />
                          </div>
                          <div>
                            <Label htmlFor="blockCategory">Category</Label>
                            <Select value={newBlock.category} onValueChange={(value) => setNewBlock({...newBlock, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORIES.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="blockDescription">Description</Label>
                          <Textarea
                            id="blockDescription"
                            value={newBlock.description}
                            onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
                            placeholder="Describe the service or expense type"
                          />
                        </div>
                        
                        <div>
                          <Label>Pricing Tiers</Label>
                          <div className="space-y-2">
                            {newBlock.pricingTiers.map((tier, index) => (
                              <div key={index} className="grid grid-cols-3 gap-2">
                                <Input
                                  placeholder="Range/Type (e.g., 1-3 videos)"
                                  value={tier.range}
                                  onChange={(e) => {
                                    const updatedTiers = [...newBlock.pricingTiers];
                                    updatedTiers[index].range = e.target.value;
                                    setNewBlock({...newBlock, pricingTiers: updatedTiers});
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Price"
                                  value={tier.price}
                                  onChange={(e) => {
                                    const updatedTiers = [...newBlock.pricingTiers];
                                    updatedTiers[index].price = parseFloat(e.target.value) || 0;
                                    setNewBlock({...newBlock, pricingTiers: updatedTiers});
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (newBlock.pricingTiers.length > 1) {
                                      const updatedTiers = newBlock.pricingTiers.filter((_, i) => i !== index);
                                      setNewBlock({...newBlock, pricingTiers: updatedTiers});
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewBlock({
                                ...newBlock,
                                pricingTiers: [...newBlock.pricingTiers, { range: '', price: 0, type: 'fixed' }]
                              })}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Pricing Tier
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateBlockOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateBlock}>
                            Create Block
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" onClick={resetToDefaults}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  
                  <Button variant="outline" onClick={() => handleExportData('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                      id="import-file"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('import-file').click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Search blocks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="created">Created Date</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      List
                    </Button>
                  </div>
                </div>
                
                {/* Bulk Actions */}
                {selectedBlocks.length > 0 && (
                  <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">{selectedBlocks.length} blocks selected</span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Bulk action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activate">Activate</SelectItem>
                        <SelectItem value="deactivate">Deactivate</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleBulkAction} disabled={!bulkAction}>
                      Apply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedBlocks([])}>
                      Clear Selection
                    </Button>
                  </div>
                )}
                
                {/* Blocks Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
                  {filteredBlocks.map((block) => (
                    <Card key={block.id} className={`${viewMode === 'list' ? 'p-4' : ''} hover:shadow-md transition-shadow`}>
                      <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedBlocks.includes(block.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBlocks([...selectedBlocks, block.id]);
                                } else {
                                  setSelectedBlocks(selectedBlocks.filter(id => id !== block.id));
                                }
                              }}
                              className="rounded"
                            />
                            <CardTitle className="text-lg">{block.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={block.isActive ? 'default' : 'secondary'}
                              style={{ backgroundColor: block.isActive ? block.color : '#gray' }}
                            >
                              {block.category}
                            </Badge>
                            <Switch
                              checked={block.isActive}
                              onCheckedChange={() => handleToggleBlockStatus(block.id)}
                              size="sm"
                            />
                          </div>
                        </div>
                        <CardDescription>{block.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {block.pricingTiers.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>{tier.range}</span>
                              <span className="font-semibold">{settings.currency}{tier.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        {block.tags && block.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {block.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            Created: {new Date(block.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditBlock(block)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDuplicateBlock(block)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteBlock(block.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>Visual insights into your expense blocks and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Block Status */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Block Status Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-800">Active Blocks</p>
                          <p className="text-2xl font-bold text-green-600">{expenseBlocks.filter(b => b.isActive).length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Inactive Blocks</p>
                          <p className="text-2xl font-bold text-gray-600">{expenseBlocks.filter(b => !b.isActive).length}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-gray-600" />
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-800">Total Categories</p>
                          <p className="text-2xl font-bold text-blue-600">{new Set(expenseBlocks.map(b => b.category)).size}</p>
                        </div>
                        <Tag className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure application preferences and defaults</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">General Settings</h4>
                    
                    <div>
                      <Label htmlFor="currency">Currency Symbol</Label>
                      <Input
                        id="currency"
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="defaultCategory">Default Category</Label>
                      <Select 
                        value={settings.defaultCategory} 
                        onValueChange={(value) => setSettings({...settings, defaultCategory: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Business Settings</h4>
                    
                    <div>
                      <Label htmlFor="profitMargin">Target Profit Margin (%)</Label>
                      <Input
                        id="profitMargin"
                        type="number"
                        value={settings.profitMargin}
                        onChange={(e) => setSettings({...settings, profitMargin: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="workingHours">Working Hours per Day</Label>
                      <Input
                        id="workingHours"
                        type="number"
                        value={settings.workingHours}
                        onChange={(e) => setSettings({...settings, workingHours: parseFloat(e.target.value) || 8})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="overtimeRate">Overtime Rate Multiplier</Label>
                      <Input
                        id="overtimeRate"
                        type="number"
                        step="0.1"
                        value={settings.overtimeRate}
                        onChange={(e) => setSettings({...settings, overtimeRate: parseFloat(e.target.value) || 1.5})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Application Preferences</h4>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={settings.notifications}
                        onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                      />
                      <Label htmlFor="notifications">Enable Notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoSave"
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                      />
                      <Label htmlFor="autoSave">Auto-save Changes</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="backupEnabled"
                        checked={settings.backupEnabled}
                        onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                      />
                      <Label htmlFor="backupEnabled">Enable Backups</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Report History
                </CardTitle>
                <CardDescription>View and manage saved project reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reportHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports saved yet</p>
                    <p className="text-sm text-gray-400">Save a report from the Budget Tracker to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportHistory.map((report) => (
                      <Card key={report.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{report.name}</h3>
                              <p className="text-sm text-gray-600">
                                Saved on {new Date(report.date).toLocaleDateString()}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                <div>
                                  <span className="text-xs text-gray-500">Monthly Budget</span>
                                  <p className="font-medium">{settings.currency}{report.monthlyBudget.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Monthly Expenses</span>
                                  <p className="font-medium">{settings.currency}{report.totalMonthlyExpenses.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Monthly Profit</span>
                                  <p className={`font-medium ${report.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {settings.currency}{report.monthlyProfit.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Project Duration</span>
                                  <p className="font-medium">{report.projectDuration} months</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setReportHistory(reportHistory.filter(r => r.id !== report.id))}
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
    </div>
  );
}

export default App;
