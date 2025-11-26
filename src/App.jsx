import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Wifi, Server, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const NetworkMonitorDashboard = () => {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Core Router', ip: '192.168.1.1', status: 'online', cpu: 45, memory: 62, latency: 12, bandwidth: 450 },
    { id: 2, name: 'Main Switch', ip: '192.168.1.2', status: 'online', cpu: 32, memory: 48, latency: 8, bandwidth: 320 },
    { id: 3, name: 'Firewall', ip: '192.168.1.3', status: 'online', cpu: 68, memory: 71, latency: 15, bandwidth: 280 },
    { id: 4, name: 'Access Point 1', ip: '192.168.1.10', status: 'warning', cpu: 78, memory: 82, latency: 25, bandwidth: 180 },
    { id: 5, name: 'Server 01', ip: '192.168.1.50', status: 'online', cpu: 41, memory: 55, latency: 10, bandwidth: 520 }
  ]);

  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Initialize historical data
  useEffect(() => {
    const initialData = [];
    for (let i = 23; i >= 0; i--) {
      initialData.push({
        time: `${i}h ago`,
        bandwidth: 300 + Math.random() * 200,
        latency: 10 + Math.random() * 15,
        cpu: 40 + Math.random() * 30
      });
    }
    setHistoricalData(initialData);
  }, []);

  // AI Anomaly Detection Engine
  const detectAnomalies = (device) => {
    const anomalies = [];
    
    // CPU threshold anomaly
    if (device.cpu > 75) {
      anomalies.push({
        type: 'critical',
        device: device.name,
        metric: 'CPU',
        value: device.cpu,
        message: `CPU usage at ${device.cpu}% - significantly above baseline of 45%`,
        prediction: 'Performance degradation likely within 2 hours'
      });
    }

    // Memory threshold anomaly
    if (device.memory > 80) {
      anomalies.push({
        type: 'warning',
        device: device.name,
        metric: 'Memory',
        value: device.memory,
        message: `Memory usage at ${device.memory}% - trending upward`,
        prediction: 'May require restart if trend continues'
      });
    }

    // Latency anomaly
    if (device.latency > 20) {
      anomalies.push({
        type: 'warning',
        device: device.name,
        metric: 'Latency',
        value: device.latency,
        message: `Latency at ${device.latency}ms - 2x normal baseline`,
        prediction: 'Network congestion or routing issue detected'
      });
    }

    return anomalies;
  };

  // Generate AI Insights
  const generateAIInsights = () => {
    const insights = [
      {
        type: 'prediction',
        title: 'Predictive Analysis',
        message: 'Access Point 1 showing resource exhaustion pattern. 78% probability of service degradation within 4 hours based on current trends.',
        confidence: 78
      },
      {
        type: 'optimization',
        title: 'Performance Optimization',
        message: 'Core Router bandwidth utilization optimal. Current load balancing configuration performing 23% better than last week.',
        confidence: 92
      },
      {
        type: 'correlation',
        title: 'Issue Correlation',
        message: 'Elevated latency across 2 devices correlates with increased traffic from subnet 192.168.50.0/24. Possible bandwidth saturation.',
        confidence: 85
      }
    ];
    return insights;
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          cpu: Math.max(20, Math.min(95, device.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(30, Math.min(95, device.memory + (Math.random() - 0.5) * 8)),
          latency: Math.max(5, Math.min(50, device.latency + (Math.random() - 0.5) * 5)),
          bandwidth: Math.max(100, Math.min(800, device.bandwidth + (Math.random() - 0.5) * 50)),
          status: device.cpu > 85 || device.memory > 90 ? 'critical' : device.cpu > 75 || device.memory > 80 ? 'warning' : 'online'
        }))
      );

      // Update historical data
      setHistoricalData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: 'now',
          bandwidth: 300 + Math.random() * 200,
          latency: 10 + Math.random() * 15,
          cpu: 40 + Math.random() * 30
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update alerts based on anomaly detection
  useEffect(() => {
    const newAlerts = [];
    devices.forEach(device => {
      const anomalies = detectAnomalies(device);
      newAlerts.push(...anomalies);
    });
    setAlerts(newAlerts.slice(0, 5)); // Keep last 5 alerts
    setAiInsights(generateAIInsights());
  }, [devices]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'online': return 'bg-green-100 border-green-300';
      case 'warning': return 'bg-yellow-100 border-yellow-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const overallHealth = devices.filter(d => d.status === 'online').length;
  const healthPercentage = Math.round((overallHealth / devices.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="text-blue-400" size={40} />
            Smart Network Monitor AI
          </h1>
          <p className="text-slate-400">Real-time monitoring with AI-powered anomaly detection and predictive analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Network Health</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{healthPercentage}%</div>
            <div className="text-xs text-slate-400 mt-1">{overallHealth}/{devices.length} devices online</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Alerts</span>
              <AlertTriangle className="text-yellow-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{alerts.length}</div>
            <div className="text-xs text-slate-400 mt-1">AI-detected anomalies</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Avg Latency</span>
              <Clock className="text-blue-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">
              {Math.round(devices.reduce((sum, d) => sum + d.latency, 0) / devices.length)}ms
            </div>
            <div className="text-xs text-slate-400 mt-1">Across all devices</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Bandwidth</span>
              <Wifi className="text-purple-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">
              {Math.round(devices.reduce((sum, d) => sum + d.bandwidth, 0))} Mbps
            </div>
            <div className="text-xs text-slate-400 mt-1">Current utilization</div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" />
            AI Insights & Predictions
          </h2>
          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <h3 className="text-white font-medium">{insight.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400">Confidence: {insight.confidence}%</span>
                </div>
                <p className="text-slate-300 text-sm">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Trends */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Network Metrics (24h)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="bandwidth" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Bandwidth (Mbps)" />
                <Area type="monotone" dataKey="latency" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active Alerts */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-400" />
              Active Alerts & Anomalies
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-slate-400 text-center py-8">
                  <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
                  No anomalies detected
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className={`rounded-lg p-4 border ${alert.type === 'critical' ? 'bg-red-950 border-red-800' : 'bg-yellow-950 border-yellow-800'}`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'} size={20} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-medium text-sm">{alert.device} - {alert.metric}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${alert.type === 'critical' ? 'bg-red-800 text-red-200' : 'bg-yellow-800 text-yellow-200'}`}>
                            {alert.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs mb-2">{alert.message}</p>
                        <p className="text-slate-400 text-xs italic">Prediction: {alert.prediction}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Device Status Grid */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="text-purple-400" />
            Device Status Monitor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <div 
                key={device.id} 
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-xl ${getStatusBg(device.status)}`}
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {device.status === 'online' ? 
                      <CheckCircle className="text-green-600" size={20} /> : 
                      <XCircle className={device.status === 'critical' ? 'text-red-600' : 'text-yellow-600'} size={20} />
                    }
                    <h3 className="font-semibold text-slate-900">{device.name}</h3>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 mb-3">{device.ip}</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-700">CPU</span>
                      <span className="font-medium text-slate-900">{Math.round(device.cpu)}%</span>
                    </div>
                    <div className="w-full bg-slate-300 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${device.cpu > 75 ? 'bg-red-500' : device.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${device.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-700">Memory</span>
                      <span className="font-medium text-slate-900">{Math.round(device.memory)}%</span>
                    </div>
                    <div className="w-full bg-slate-300 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${device.memory > 80 ? 'bg-red-500' : device.memory > 65 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{ width: `${device.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-700">Latency: <span className="font-medium text-slate-900">{Math.round(device.latency)}ms</span></span>
                    <span className="text-slate-700">BW: <span className="font-medium text-slate-900">{Math.round(device.bandwidth)} Mbps</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>AI-Powered Network Monitoring • Real-time Anomaly Detection • Predictive Analytics</p>
          <p className="mt-1">Built with React + Recharts • Simulated Network Data</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitorDashboard;
