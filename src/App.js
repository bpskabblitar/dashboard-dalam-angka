import React, { useState, useEffect, useCallback } from 'react';
import { Grid3x3, X, Filter } from 'lucide-react';
import { Book } from 'lucide-react'; 
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ScatterChart, Scatter 
} from 'recharts';

import './design2.css'; 

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const COLORS = ['#465fff', '#12b76a', '#f79009', '#f04438', '#0ba5ec', '#ee46bc'];

  useEffect(() => {
    setSelectedSubCategory('');
  }, [selectedCategory]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-container">
          <p className="tooltip-label">{label}</p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color, fontSize: '16px', margin: '4px 0', fontWeight: 500 }}>
              {`${p.name}: ${p.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLineLabel = useCallback(({ x, y, value }) => {
    if (value === null || value === undefined) return null;
    return (
      <text x={x} y={y} dy={-10} fill="#101828" fontSize="14px" textAnchor="middle" fontWeight="bold">
        {value}
      </text>
    );
  }, []);

  const renderPieCustomizedLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, fill }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';
    const percentText = `${(percent * 100).toFixed(1)}%`;

    return (
      <text x={x} y={y} fill="#131313ff" textAnchor={textAnchor} dominantBaseline="central" fontSize="16px" fontWeight="500">
        {`${name} (${percentText})`}
      </text>
    );
  }, []);

  const renderBarLabel = useCallback(({ x, y, width, value }) => {
    if (!value) return null;
    return (
      <text x={x + width / 2} y={y - 10} fill="#101828" textAnchor="middle" fontSize="12px" fontWeight="bold">
        {value}
      </text>
    );
  }, []);

  const ChartRenderer = ({ chartItem }) => {
    const cartesianProps = { strokeDasharray: "3 3", stroke: "#e4e7ec" }; 
    const axisProps = { stroke: "#475467", fontSize: 20, tickLine: false, axisLine: false }; 
    
    const legendStyle = {
      fontSize: '16px',
      border: '1px solid #e4e7ec',
      paddingTop: '8px',
      borderRadius: '8px',
      margin: '0 auto',
      color: '#101828'
    };

    switch (chartItem.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartItem.data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid {...cartesianProps} vertical={false} />
              <XAxis dataKey={chartItem.xAxisKey} {...axisProps} dy={2} tick={{ fill: '#101828', fontSize: 16, fontWeight: 'bold' }} />
              <YAxis {...axisProps} tick={{ fill: '#475467', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f2f4f7'}} />
              <Legend wrapperStyle={legendStyle} />
              {chartItem.keys.map((key, index) => (
                <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={COLORS[index % COLORS.length]} 
                    name={key.replace(/_/g, ' ')} 
                    label={renderBarLabel} 
                    radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartItem.data} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid {...cartesianProps} vertical={false} />
              <XAxis dataKey={chartItem.xAxisKey} {...axisProps} dy={10} tick={{ fill: '#101828', fontSize: 16, fontWeight: 'bold' }} />
              <YAxis {...axisProps} tick={{ fill: '#475467' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              {chartItem.keys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: COLORS[index % COLORS.length] }}
                  activeDot={{ r: 6 }}
                  name={key.replace(/_/g, ' ')}
                  label={renderLineLabel}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartItem.data}
                cx="50%"
                cy="50%"
                label={renderPieCustomizedLabel}
                outerRadius={110}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {chartItem.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartItem.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid {...cartesianProps} />
              <XAxis dataKey={chartItem.xAxisKey} {...axisProps} tick={{ fill: '#101828', fontSize: 16, fontWeight: 'bold' }} />
              <YAxis {...axisProps} tick={{ fill: '#475467' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle}/>
              {chartItem.keys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'line-area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartItem.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid {...cartesianProps} vertical={false} />
              <XAxis dataKey={chartItem.xAxisKey} {...axisProps} dy={10} tick={{ fill: '#101828', fontSize: 16, fontWeight: 'bold' }} />
              <YAxis {...axisProps} tick={{ fill: '#475467' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              {chartItem.keys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.6}
                  name={key.replace(/_/g, ' ')}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
    
    case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid {...cartesianProps} />
              <XAxis type="category" dataKey={chartItem.xAxisKey} {...axisProps} tick={{ fill: '#101828', fontSize: 16, fontWeight: 'bold' }} />
              <YAxis type="number" dataKey={chartItem.keys[0]} {...axisProps} tick={{ fill: '#475467' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Data" data={chartItem.data} fill="#8884d8">
                  {chartItem.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <p className="text-gray-400 italic">Tipe chart tidak dikenal.</p>;
    }
  };

  // ... (Data contentData tetap sama, tidak perlu diubah, copy paste bagian bawah ini dari file asli Anda jika perlu, atau gunakan kode lengkap di bawah)
  
  const contentData = {
    kanigoro: {
      title: 'Kecamatan Kanigoro',
      color: 'blue', 
      icon: <Book />,
      description: 'Pilih Bab untuk menampilkan data statistik',
      subCategories: {
        'bab1': {
          title: 'BAB 1',
          description: 'Geografi',
          charts: [
            {
              id: 'bab1-bar-chart1',
              type: 'bar',
              title: 'Status Pemerintahan Desa/Kelurahan',
              xAxisKey: 'desa',
              keys: ['Desa', 'kelurahan'],
              data: [
                { desa: 'Minggirsari', Desa: 1},
                { desa: 'Gogodeso', Desa: 1},
                { desa: 'Karangsono', Desa: 1},
                { desa: 'Satreyan', kelurahan: 1},
                { desa: 'Kanigoro', kelurahan: 1},
                { desa: 'Tlogo', Desa: 1},
                { desa: 'Gaprang', Desa: 1},
                { desa: 'Jatinom', Desa: 1},
                { desa: 'Kuningan', Desa: 1},
                { desa: 'Papungan', Desa: 1},
                { desa: 'Banggle', Desa: 1},
                { desa: 'Sawentar', Desa: 1}
              ],
            },
            {
              id: 'bab1-bar-chart2',
              type: 'bar',
              title: 'Jarak ke Ibukota Kecamatan dan Ibukota Kabupaten/Kota (km)',
              xAxisKey: 'desa',
              keys: ['jarak_ke_ibukota_kecamatan', 'jarak_ke_ibukota_kab_kota'],
              data: [
                { desa: 'Minggirsari', jarak_ke_ibukota_kecamatan: 8, jarak_ke_ibukota_kab_kota: 8},
                { desa: 'Gogodeso', jarak_ke_ibukota_kecamatan: 5, jarak_ke_ibukota_kab_kota: 4},
                { desa: 'Karangsono', jarak_ke_ibukota_kecamatan: 3, jarak_ke_ibukota_kab_kota: 2},
                { desa: 'Satreyan', jarak_ke_ibukota_kecamatan: 1, jarak_ke_ibukota_kab_kota: 1},
                { desa: 'Kanigoro', jarak_ke_ibukota_kecamatan: 1, jarak_ke_ibukota_kab_kota: 1},
                { desa: 'Tlogo', jarak_ke_ibukota_kecamatan: 3, jarak_ke_ibukota_kab_kota: 2},
                { desa: 'Gaprang', jarak_ke_ibukota_kecamatan: 4, jarak_ke_ibukota_kab_kota: 3},
                { desa: 'Jatinom', jarak_ke_ibukota_kecamatan: 7, jarak_ke_ibukota_kab_kota: 6},
                { desa: 'Kuningan', jarak_ke_ibukota_kecamatan: 5, jarak_ke_ibukota_kab_kota: 4},
                { desa: 'Papungan', jarak_ke_ibukota_kecamatan: 5, jarak_ke_ibukota_kab_kota: 5},
                { desa: 'Banggle', jarak_ke_ibukota_kecamatan: 3, jarak_ke_ibukota_kab_kota: 3},
                { desa: 'Sawentar', jarak_ke_ibukota_kecamatan: 3, jarak_ke_ibukota_kab_kota: 4}
              ],
            },
            {
              id: 'bab1-pie-chart1',
              type: 'pie',
              title: 'Letak Wilayah (Jumlah desa adalah 12)',
              description: 'Karena tidak ada desa yang berada dalam kawasan hutan atau di tepi kawasan hutan, maka seluruh desa berada di luar kawasan hutan.',
              data: [
                { name: 'Dalam Kawasan Hutan', value: 0, color: '#0053d9ff' },
                { name: 'Tepi Kawasan Hutan', value: 0, color: '#10b981' },
                { name: 'Luar Kawasan Hutan', value: 12, color: '#ffd793ff' }
              ],
            },
            {
              id: 'bab1-bar-chart3',
              type: 'bar',
              title: 'Letak Topografi Wilayah Menurut Desa/Kelurahan',
              xAxisKey: 'desa',
              keys: ['lereng', 'dataran'],
              data: [
                { desa: 'Minggirsari', lereng: 1},
                { desa: 'Gogodeso', lereng: 1},
                { desa: 'Karangsono', lereng: 1},
                { desa: 'Satreyan', dataran: 1},
                { desa: 'Kanigoro', lereng: 1},
                { desa: 'Tlogo', lereng: 1},
                { desa: 'Gaprang', lereng: 1},
                { desa: 'Jatinom', lereng: 1},
                { desa: 'Kuningan', lereng: 1},
                { desa: 'Papungan', lereng: 1},
                { desa: 'Banggle', lereng: 1},
                { desa: 'Sawentar', lereng: 1}
              ],
            },
            {
              id: 'bab1-bar-chart3',
              type: 'bar',
              title: 'Hari Hujan (Hari) dan Curah Hujan (Mm) Januari-Desember 2024',
              xAxisKey: 'bulan',
              keys: ['hari_hujan', 'curah_hujan'],
              data: [
                { bulan: 'Januari', hari_hujan: 6, curah_hujan: 96},
                { bulan: 'Februari', hari_hujan: 19, curah_hujan: 357},
                { bulan: 'Maret', hari_hujan: 12, curah_hujan: 284},
                { bulan: 'April', hari_hujan: 6, curah_hujan: 197},
                { bulan: 'Mei', hari_hujan: 4, curah_hujan: 134},
                { bulan: 'Juni', hari_hujan: 7, curah_hujan: 37},
                { bulan: 'Juli', hari_hujan: 5, curah_hujan: 147},
                { bulan: 'Agustus', hari_hujan: 0, curah_hujan: 0},
                { bulan: 'September', hari_hujan: 0, curah_hujan: 0},
                { bulan: 'Oktober', hari_hujan: 0, curah_hujan: 0},
                { bulan: 'November', hari_hujan: 4, curah_hujan: 32},
                { bulan: 'Desember', hari_hujan: 3, curah_hujan: 69}
              ],
            },
            {
              id: 'bab1-bar-chart4',
              type: 'bar',
              title: 'Luas Total Area (km^2/sq.km)',
              xAxisKey: 'desa',
              keys: ['luas'],
              data: [
                { desa: 'Minggirsari', luas: 1.86},
                { desa: 'Gogodeso', luas: 3.12},
                { desa: 'Karangsono', luas: 3.39},
                { desa: 'Satreyan', luas: 5.3},
                { desa: 'Kanigoro', luas: 2.92},
                { desa: 'Tlogo', luas: 3.18},
                { desa: 'Gaprang', luas: 2.13},
                { desa: 'Jatinom', luas: 2.36},
                { desa: 'Kuningan', luas: 2.74},
                { desa: 'Papungan', luas: 3.63},
                { desa: 'Banggle', luas: 5.52},
                { desa: 'Sawentar', luas: 19.4}
              ],
            },
            {
              id: 'bab1-pie-chart2',
              type: 'pie',
              title: 'Persentase terhadap Luas Kecamatan',
              data: [
                { name: 'Minggirsari', value: 3.35},
                { name: 'Gogodeso', value: 5.62},
                { name: 'Karangsono', value: 6.1},
                { name: 'Satreyan', value: 9.54},
                { name: 'Kanigoro', value: 5.26},
                { name: 'Tlogo', value: 5.72},
                { name: 'Gaprang', value: 3.83},
                { name: 'Jatinom', value: 4.25},
                { name: 'Kuningan', value: 4.93},
                { name: 'Papungan', value: 6.53},
                { name: 'Banggle', value: 9.94},
                { name: 'Sawentar', value: 34.92}
              ],
            },
          ],
        },
        'bab2': {
          title: 'BAB 2',
          description: 'Pemerintahan',
          charts: [
            {
              id: 'bab2-bar-chart1',
              type: 'bar',
              title: 'Banyaknya Dusun, RW, dan RT Menurut Desa',
              xAxisKey: 'desa',
              keys: ['dusun', 'RW', 'RT'],
              data: [
                { desa: 'Minggirsari', dusun: 3, RW: 6, RT: 16},
                { desa: 'Gogodeso', dusun: 4, RW: 13, RT: 31},
                { desa: 'Karangsono', dusun: 3, RW: 8, RT: 30},
                { desa: 'Satreyan', dusun: 4, RW: 9, RT: 24},
                { desa: 'Kanigoro', dusun: 3, RW: 9, RT: 35},
                { desa: 'Tlogo', dusun: 3, RW: 10, RT: 41},
                { desa: 'Gaprang', dusun: 2, RW: 12, RT: 34},
                { desa: 'Jatinom', dusun: 3, RW: 9, RT: 27},
                { desa: 'Kuningan', dusun: 1, RW: 5, RT: 19},
                { desa: 'Papungan', dusun: 3, RW: 9, RT: 34},
                { desa: 'Banggle', dusun: 5, RW: 11, RT: 45},
                { desa: 'Sawentar', dusun: 4, RW: 17, RT: 65}
              ],
            },
            {
              id: 'bab2-bar-chart2',
              type: 'bar',
              title: 'Keberadaan Kelembagaan Desa Dirinci Menurut Desa',
              xAxisKey: 'desa',
              keys: ['pengurus_BPD_LMK'],
              data: [
                { desa: 'Minggirsari', pengurus_BPD_LMK: 7},
                { desa: 'Gogodeso', pengurus_BPD_LMK: 9},
                { desa: 'Karangsono', pengurus_BPD_LMK: 9},
                { desa: 'Satreyan', pengurus_BPD_LMK: 0},
                { desa: 'Kanigoro', pengurus_BPD_LMK: 0},
                { desa: 'Tlogo', pengurus_BPD_LMK: 9},
                { desa: 'Gaprang', pengurus_BPD_LMK: 7},
                { desa: 'Jatinom', pengurus_BPD_LMK: 9},
                { desa: 'Kuningan', pengurus_BPD_LMK: 7},
                { desa: 'Papungan', pengurus_BPD_LMK: 9},
                { desa: 'Banggle', pengurus_BPD_LMK: 9},
                { desa: 'Sawentar', pengurus_BPD_LMK: 9}
              ],
            },
            {
              id: 'bab2-pie-chart1',
              type: 'pie',
              title: 'Jumlah Pegawai Negeri Sipil (PNS) Berdasarkan Jenis Kelamin',
              data: [
                { name: 'Laki-laki', value: 6, color: '#0053d9ff' },
                { name: 'Perempuan', value: 7, color: '#ffd793ff' }
              ],
            },
          ],
        },  
        'bab3': {
          title: 'BAB 3',
          description: 'Kependukan',
          charts: [
            {
              id: 'bab3-bar-chart1',
              type: 'bar',
              title: 'Jumlah Penduduk Menurut Jenis Kelamin dan Desa',
              xAxisKey: 'desa',
              keys: ['laki_laki', 'perempuan'],
              data: [
                { desa: 'Minggirsari', laki_laki: 1898, perempuan: 1890},
                { desa: 'Gogodeso', laki_laki: 2757, perempuan: 2801},
                { desa: 'Karangsono', laki_laki: 3110, perempuan: 3158},
                { desa: 'Satreyan', laki_laki: 4374, perempuan: 4401},
                { desa: 'Kanigoro', laki_laki: 3077, perempuan: 3066},
                { desa: 'Tlogo', laki_laki: 3456, perempuan: 3470},
                { desa: 'Gaprang', laki_laki: 2734, perempuan: 2856},
                { desa: 'Jatinom', laki_laki: 2685, perempuan: 2667},
                { desa: 'Kuningan', laki_laki: 1522, perempuan: 1533},
                { desa: 'Papungan', laki_laki: 3336, perempuan: 3284},
                { desa: 'Banggle', laki_laki: 4513, perempuan: 4525},
                { desa: 'Sawentar', laki_laki: 7300, perempuan: 7072}
              ],
            },
            {
              id: 'bab3-pie-chart1',
              type: 'pie',
              title: 'Persentase Penduduk Menurut Desa',
              data: [
                { name: 'Minggirsari', value: 4.56},
                { name: 'Gogodeso', value: 6.82},
                { name: 'Karangsono', value: 7.69},
                { name: 'Satreyan', value: 10.77},
                { name: 'Kanigoro', value: 7.54},
                { name: 'Tlogo', value: 8.50},
                { name: 'Gaprang', value: 6.86},
                { name: 'Jatinom', value: 6.57},
                { name: 'Kuningan', value: 3.75},
                { name: 'Papungan', value: 8.12},
                { name: 'Banggle', value: 11.09},
                { name: 'Sawentar', value: 17.64}
              ],
            },
            {
              id: 'bab3-bar-chart2',
              type: 'bar',
              title: 'Jumlah Penduduk 2022-2024',
              xAxisKey: 'tahun',
              keys: ['laki_Laki', 'perempuan'],
              data: [
                { tahun: '2022', laki_Laki: 40694, perempuan: 81769},
                { tahun: '2023', laki_Laki: 39713, perempuan: 79754},
                { tahun: '2024', laki_Laki: 39938, perempuan: 79916}
              ],
            },
            {
              id: 'bab3-line-chart1',
              type: 'line',
              title: 'Penduduk Menurut Kelompok Umur',
              xAxisKey: 'kelompok_umur',
              keys: ['laki_laki', 'perempuan'],
              data: [
                { kelompok_umur: '0-4', laki_laki: 2105, perempuan: 1962},
                { kelompok_umur: '5-9', laki_laki: 2835, perempuan: 2725},
                { kelompok_umur: '10-14', laki_laki: 3199, perempuan: 3134},
                { kelompok_umur: '15-19', laki_laki: 3072, perempuan: 2954},
                { kelompok_umur: '20-24', laki_laki: 3131, perempuan: 2951},
                { kelompok_umur: '25-29', laki_laki: 2910, perempuan: 2700},
                { kelompok_umur: '30-34', laki_laki: 2616, perempuan: 2662},
                { kelompok_umur: '35-39', laki_laki: 2857, perempuan: 2805},
                { kelompok_umur: '40-44', laki_laki: 3423, perempuan: 3339},
                { kelompok_umur: '45-49', laki_laki: 3071, perempuan: 3177},
                { kelompok_umur: '50-54', laki_laki: 2979, perempuan: 3125},
                { kelompok_umur: '55-59', laki_laki: 2605, perempuan: 2739},
                { kelompok_umur: '60-64', laki_laki: 2053, perempuan: 2179},
                { kelompok_umur: '65-69', laki_laki: 1536, perempuan: 1638},
                { kelompok_umur: '70-75', laki_laki: 1119, perempuan: 1091},
                { kelompok_umur: '75+', laki_laki: 1119, perempuan: 1542}
              ],
            },  
          ],
        },
        'bab4': {
          title: 'BAB 4',
          description: 'Sosial dan Kesejahteraan',
          charts: [
            {
              id: 'bab4-line-chart1',
              type: 'line',
              title: 'Banyaknya Desa yang Memiliki Fasilitas Sekolah Menurut Tingkat Pendidikan',
              description: 'Data tahun 2022-2024 untuk tingkat pendidikan SD, MI, SMP, MTs, SMA, SMK, MA, dan Perguruan Tinggi tidak ada perubahan maka grafik menunjukkan garis yang sama.',
              xAxisKey: 'tingkat_pendidikan',
              keys: ['tahun_2022', 'tahun_2023', 'tahun_2024'],
              data: [
                { tingkat_pendidikan: 'SD', tahun_2022: 12, tahun_2023: 12, tahun_2024: 12},
                { tingkat_pendidikan: 'MI', tahun_2022: 12, tahun_2023: 12, tahun_2024: 12},
                { tingkat_pendidikan: 'SMP', tahun_2022: 4, tahun_2023: 4, tahun_2024: 4},
                { tingkat_pendidikan: 'MTs', tahun_2022: 7, tahun_2023: 7, tahun_2024: 7},
                { tingkat_pendidikan: 'SMA', tahun_2022: 0, tahun_2023: 0, tahun_2024: 0},
                { tingkat_pendidikan: 'SMK', tahun_2022: 1, tahun_2023: 1, tahun_2024: 1},
                { tingkat_pendidikan: 'MA', tahun_2022: 4, tahun_2023: 4, tahun_2024: 4},
                { tingkat_pendidikan: 'Perguruan Tinggi', tahun_2022: 0, tahun_2023: 0, tahun_2024: 0}
              ],
            },
            {
              id: 'bab4-bar-chart2',
              type: 'bar',
              title: 'Jumlah Sekolah Menurut Tingkat Pendidikan',
              xAxisKey: 'tingkat_pendidikan',
              keys: ['negeri', 'swasta'],
              data: [
                { tingkat_pendidikan: 'TK', negeri: 0, swasta: 48},
                { tingkat_pendidikan: 'RA', negeri: 5, swasta: 42},
                { tingkat_pendidikan: 'SD', negeri: 23, swasta: 23},
                { tingkat_pendidikan: 'MI', negeri: 0, swasta: 25},
                { tingkat_pendidikan: 'SMP', negeri: 1, swasta: 5},
                { tingkat_pendidikan: 'MTs', negeri: 0, swasta: 7},
                { tingkat_pendidikan: 'SMA', negeri: 0, swasta: 0},
                { tingkat_pendidikan: 'SMK', negeri: 0, swasta: 2},
                { tingkat_pendidikan: 'MA', negeri: 1, swasta: 4}
              ],
            },
            {
              id: 'bab4-bar-chart3',
              type: 'bar',
              title: 'Jumlah Guru Menurut Tingkat Pendidikan',
              xAxisKey: 'tingkat_pendidikan',
              keys: ['negeri', 'swasta'],
              data: [
                { tingkat_pendidikan: 'TK', negeri: 0, swasta: 167},
                { tingkat_pendidikan: 'RA', negeri: 0, swasta: 42},
                { tingkat_pendidikan: 'SD', negeri: 192, swasta: 13},
                { tingkat_pendidikan: 'MI', negeri: 0, swasta: 306},
                { tingkat_pendidikan: 'SMP', negeri: 49, swasta: 28},
                { tingkat_pendidikan: 'MTs', negeri: 0, swasta: 129},
                { tingkat_pendidikan: 'SMA', negeri: 0, swasta: 0},
                { tingkat_pendidikan: 'SMK', negeri: 0, swasta: 28},
                { tingkat_pendidikan: 'MA', negeri: 95, swasta: 70}
              ],
            },
            {
              id: 'bab4-bar-chart5',
              type: 'bar',
              title: 'Jumlah Murid Menurut Tingkat Pendidikan',
              xAxisKey: 'tingkat_pendidikan',
              keys: ['negeri', 'swasta'],
              data: [
                { tingkat_pendidikan: 'TK', negeri: 0, swasta: 1711},
                { tingkat_pendidikan: 'RA', negeri: 0, swasta: 352},
                { tingkat_pendidikan: 'SD', negeri: 2818, swasta: 157},
                { tingkat_pendidikan: 'MI', negeri: 0, swasta: 3294},
                { tingkat_pendidikan: 'SMP', negeri: 904, swasta: 241},
                { tingkat_pendidikan: 'MTs', negeri: 0, swasta: 1327},
                { tingkat_pendidikan: 'SMA', negeri: 0, swasta: 0},
                { tingkat_pendidikan: 'SMK', negeri: 0, swasta: 211},
                { tingkat_pendidikan: 'MA', negeri: 1193, swasta: 595}
              ],
            },
            {
              id: 'fasilitas-kesehatan-bar',
              type: 'bar',
              title: 'Perbandingan Sarana Kesehatan',
              xAxisKey: 'tahun',
              keys: ['RumahSakit', 'Puskesmas', 'Apotek'], 
              data: [
                { tahun: '2022', RumahSakit: 0, Puskesmas: 1, Apotek: 2 },
                { tahun: '2023', RumahSakit: 0, Puskesmas: 1, Apotek: 0 },
                { tahun: '2024', RumahSakit: 1, Puskesmas: 1, Apotek: 4 },
              ],
            },
            {
              id: 'bab4-bar-chart5',
              type: 'bar',
              title: 'Banyaknya Warga Penderita Kekurangan Gizi Menurut Desa',
              xAxisKey: 'desa',
              keys: ['tahun_2024'],
              data: [
                { desa: 'Minggirsari', tahun_2024: 6},
                { desa: 'Gogodeso', tahun_2024: 4},
                { desa: 'Karangsono', tahun_2024: 21},
                { desa: 'Satreyan', tahun_2024: 20},
                { desa: 'Kanigoro', tahun_2024: 19},
                { desa: 'Tlogo', tahun_2024: 14},
                { desa: 'Gaprang', tahun_2024: 11},
                { desa: 'Jatinom', tahun_2024: 14},
                { desa: 'Kuningan', tahun_2024: 1},
                { desa: 'Papungan', tahun_2024: 12},
                { desa: 'Banggle', tahun_2024: 34},
                { desa: 'Sawentar', tahun_2024: 29}
              ],
            },
            {
              id: 'bab4-bar-chart6',
              type: 'bar',
              title: 'Jumlah Tenaga Kesehatan Menurut Desa',
              xAxisKey: 'desa',
              keys: ['dokter_umum', 'dokter_gigi', 'perawat', 'bidan'],
              data: [
                { desa: 'Minggirsari', dokter_umum: 0, dokter_gigi: 0, perawat: 1, bidan: 3},
                { desa: 'Gogodeso', dokter_umum: 0, dokter_gigi: 0, perawat: 0, bidan: 0},
                { desa: 'Karangsono', dokter_umum: 0, dokter_gigi: 0, perawat: 3, bidan: 4},
                { desa: 'Satreyan', dokter_umum: 1, dokter_gigi: 1, perawat: 1, bidan: 1},
                { desa: 'Kanigoro', dokter_umum: 10, dokter_gigi: 5, perawat: 56, bidan: 31},
                { desa: 'Tlogo', dokter_umum: 4, dokter_gigi: 1, perawat: 0, bidan: 1},
                { desa: 'Gaprang', dokter_umum: 1, dokter_gigi: 1, perawat: 1, bidan: 4},
                { desa: 'Jatinom', dokter_umum: 1, dokter_gigi: 1, perawat: 1, bidan: 1},
                { desa: 'Kuningan', dokter_umum: 1, dokter_gigi: 0, perawat: 1, bidan: 1},
                { desa: 'Papungan', dokter_umum: 5, dokter_gigi: 0, perawat: 2, bidan: 6},
                { desa: 'Banggle', dokter_umum: 0, dokter_gigi: 0, perawat: 0 , bidan: 3},
                { desa: 'Sawentar', dokter_umum: 2, dokter_gigi: 2, perawat: 3, bidan: 4}
              ],
            },
            {
              id: 'bab4-pie-chart1',
              type: 'pie',
              title: 'PUS dan Peserta KB di Kecamatan Kanigoro Tahun 2024',
              description: 'PUS: Pasangan Usia Subur (umur 15-49 tahun) : 12950, KB: Keluarga Berencana : 8465, PAMKEJ: Peserta Aktif Metode Kontrasepsi Jangka Panjang : 2414, PA MANDIRI: Peserta Aktif Metode Kontrasepsi Mandiri : 3631',
              data: [
                { name: 'Jumlah PUS', value: 12950},
                { name: 'PUS Yang Ikut KB', value: 8465},
                { name: 'PAMKEJ', value: 2414},
                { name: 'PA MANDIRI', value: 3631}
              ],
            },
            {
              id: 'bab4-bar-chart6',
              type: 'bar',
              title: 'Jumlah Peserta KB Aktif Menurut Desa dan Metode Kontrasepsi',
              description: 'Metode Kontrasepsi Jangka Panjang (IUD, MOP, MOW, IMPLANT)',
              xAxisKey: 'desa',
              keys: ['IUD', 'MOP', 'MOW', 'IMPLANT'],
              data: [
                { desa: 'Minggirsari', IUD: 258, MOP: 1, MOW: 25, IMPLANT: 77},
                { desa: 'Gogodeso', IUD: 240, MOP: 2, MOW: 19, IMPLANT: 42},
                { desa: 'Karangsono', IUD: 217, MOP: 2, MOW: 30, IMPLANT: 64},
                { desa: 'Satreyan', IUD: 223, MOP: 2, MOW: 38, IMPLANT: 87},
                { desa: 'Kanigoro', IUD: 218, MOP: 1, MOW: 20, IMPLANT: 36},
                { desa: 'Tlogo', IUD: 206, MOP: 2, MOW: 27, IMPLANT: 52},
                { desa: 'Gaprang', IUD: 289, MOP: 2, MOW: 26, IMPLANT: 44},
                { desa: 'Jatinom', IUD: 210, MOP: 1, MOW: 22, IMPLANT: 39},
                { desa: 'Kuningan', IUD: 275, MOP: 3, MOW: 14, IMPLANT: 51},
                { desa: 'Papungan', IUD: 225, MOP: 2, MOW: 21, IMPLANT: 49},
                { desa: 'Banggle', IUD: 306, MOP: 4, MOW: 28 , IMPLANT: 79},
                { desa: 'Sawentar', IUD: 212, MOP: 2, MOW: 50, IMPLANT: 98}
              ],
            },
            {
              id: 'bab4-bar-chart7',
              type: 'bar',
              title: 'Kelahiran dan Kematian Bayi Dirinci Menurut Desa',
              xAxisKey: 'desa',
              keys: ['kelahiran', 'kematian'],
              data: [
                { desa: 'Minggirsari', kelahiran: 37, kematian: 1},
                { desa: 'Gogodeso', kelahiran: 56, kematian: 0},
                { desa: 'Karangsono', kelahiran: 58, kematian: 1},
                { desa: 'Satreyan', kelahiran: 62, kematian: 0},
                { desa: 'Kanigoro', kelahiran: 62, kematian: 2},
                { desa: 'Tlogo', kelahiran: 54, kematian: 0},
                { desa: 'Gaprang', kelahiran: 45, kematian: 0},
                { desa: 'Jatinom', kelahiran: 38, kematian: 0},
                { desa: 'Kuningan', kelahiran: 32, kematian: 0},
                { desa: 'Papungan', kelahiran: 83, kematian: 1},
                { desa: 'Banggle', kelahiran: 92, kematian: 0},
                { desa: 'Sawentar', kelahiran: 132, kematian: 3}
              ],
            },
            {
              id: 'bab4-bar-chart8',
              type: 'bar',
              title: 'Banyaknya Persalinan Menurut Penolong Persalinan dan Desa',
              xAxisKey: 'desa',
              keys: ['dokter', 'bidan'],
              data: [
                { desa: 'Minggirsari', dokter: 12, bidan: 24},
                { desa: 'Gogodeso', dokter: 18, bidan: 37},
                { desa: 'Karangsono', dokter: 17, bidan: 41},
                { desa: 'Satreyan', dokter: 18, bidan: 42},
                { desa: 'Kanigoro', dokter: 18, bidan: 45},
                { desa: 'Tlogo', dokter: 21, bidan: 33},
                { desa: 'Gaprang', dokter: 16, bidan: 29},
                { desa: 'Jatinom', dokter: 15, bidan: 23},
                { desa: 'Kuningan', dokter: 13, bidan: 19},
                { desa: 'Papungan', dokter: 27, bidan: 56},
                { desa: 'Banggle', dokter: 21, bidan: 71},
                { desa: 'Sawentar', dokter: 40, bidan: 94}
              ],
            },
            {
              id: 'bab4-bar-chart9',
              type: 'bar',
              title: 'Banyaknya Persalinan Menurut Tempat Persalinan dan Desa',
              xAxisKey: 'desa',
              keys: ['RS', 'Puskesmas'],
              data: [
                { desa: 'Minggirsari', RS: 18, Puskesmas: 18},
                { desa: 'Gogodeso', RS: 32, Puskesmas: 23},
                { desa: 'Karangsono', RS: 33, Puskesmas: 25},
                { desa: 'Satreyan', RS: 33, Puskesmas: 27},
                { desa: 'Kanigoro', RS: 36, Puskesmas: 27},
                { desa: 'Tlogo', RS: 35, Puskesmas: 19},
                { desa: 'Gaprang', RS: 34, Puskesmas: 11},
                { desa: 'Jatinom', RS: 21, Puskesmas: 17},
                { desa: 'Kuningan', RS: 19, Puskesmas: 13},
                { desa: 'Papungan', RS: 44, Puskesmas: 39},
                { desa: 'Banggle', RS: 40, Puskesmas: 52},
                { desa: 'Sawentar', RS: 51, Puskesmas: 83}
              ],
            },
            {
              id: 'bab4-pie-chart2',
              type: 'pie',
              title: 'Jenis Kelamin Bayi Yang Lahir',
              description: 'Laki-laki: 384, Perempuan: 387',
              data: [
                { name: 'Laki-laki', value: 384},
                { name: 'Perempuan', value: 387}
              ],
            },
            {
              id: 'tren-kesehatan-line',
              type: 'line',
              title: 'Tren Kesehatan Ibu & Anak (2021-2024)',
              xAxisKey: 'tahun',
              keys: ['jumlah_balita', 'kelompok_timbang', 'total_bkia'],
              data: [
                { tahun: '2021', jumlah_balita: 4645, kelompok_timbang: 4383, total_bkia: 7118 },
                { tahun: '2022', jumlah_balita: 4993, kelompok_timbang: 4097, total_bkia: 6992 },
                { tahun: '2023', jumlah_balita: 4393, kelompok_timbang: 4383, total_bkia: 6328 },
                { tahun: '2024', jumlah_balita: 4751, kelompok_timbang: 4097, total_bkia: 6438 },
              ],
            },
            {
              id: 'bab1-bar-chart10',
              type: 'bar',
              title: 'Jumlah Pasien Umum dan BJPS yang Berkunjung ke Puskesmas Pada Setiap Bulan',
              xAxisKey: 'bulan',
              keys: ['umum', 'BPJS'],
              data: [
                { bulan: 'Januari', umum: 771, BPJS: 1806},
                { bulan: 'Februari', umum: 500, BPJS: 1505},
                { bulan: 'Maret', umum: 587, BPJS: 1443},
                { bulan: 'April', umum: 508, BPJS: 1381},
                { bulan: 'Mei', umum: 780, BPJS: 1845},
                { bulan: 'Juni', umum: 695, BPJS: 1645},
                { bulan: 'Juli', umum: 654, BPJS: 1777},
                { bulan: 'Agustus', umum: 573, BPJS: 1888},
                { bulan: 'September', umum: 953, BPJS: 2256},
                { bulan: 'Oktober', umum: 686, BPJS: 2375},
                { bulan: 'November', umum: 677, BPJS: 2095},
                { bulan: 'Desember', umum: 880, BPJS: 2084}
              ],
            },
            {
              id: 'persentase-kinerja-kb',
              type: 'area',
              title: 'Tingkat Capaian Akseptor Baru (%)',
              description: 'Fluktuasi persentase keberhasilan pencapaian akseptor KB.',
              xAxisKey: 'tahun',
              keys: ['persentase'],
              data: [
                { tahun: '2022', persentase: 98.51 },
                { tahun: '2023', persentase: 66.68 },
                { tahun: '2024', persentase: 87.99 },
              ],
            },
            {
              id: 'target-vs-realisasi-kb',
              type: 'bar',
              title: 'Target vs Realisasi Akseptor KB Baru',
              description: 'Perbandingan target PPM dengan realisasi pencapaian akseptor di lapangan.',
              xAxisKey: 'tahun',
              keys: ['target_ppm', 'realisasi'],
              data: [
                { tahun: '2022', target_ppm: 2019, realisasi: 1989 },
                { tahun: '2023', target_ppm: 2098, realisasi: 1399 },
                { tahun: '2024', target_ppm: 1490, realisasi: 1311 },
              ],
            },
            {
              id: 'bab4-bar-chart10',
              type: 'bar',
              title: 'Pencapaian PPM Peserta Baru dan Akseptor KB Menurut Desa',
              xAxisKey: 'desa',
              keys: ['PPM_Perseta_Baru', 'Pencapain_Akseptor'],
              data: [
                { desa: 'Minggirsari', PPM_Perseta_Baru: 114, Pencapain_Akseptor: 116},
                { desa: 'Gogodeso', PPM_Perseta_Baru: 140, Pencapain_Akseptor: 143},
                { desa: 'Karangsono', PPM_Perseta_Baru: 174, Pencapain_Akseptor: 177},
                { desa: 'Satreyan', PPM_Perseta_Baru: 233, Pencapain_Akseptor: 238},
                { desa: 'Kanigoro', PPM_Perseta_Baru: 163, Pencapain_Akseptor: 165},
                { desa: 'Tlogo', PPM_Perseta_Baru: 205, Pencapain_Akseptor: 208},
                { desa: 'Gaprang', PPM_Perseta_Baru: 159, Pencapain_Akseptor: 161},
                { desa: 'Jatinom', PPM_Perseta_Baru: 153, Pencapain_Akseptor: 156},
                { desa: 'Kuningan', PPM_Perseta_Baru: 101, Pencapain_Akseptor: 102},
                { desa: 'Papungan', PPM_Perseta_Baru: 204, Pencapain_Akseptor: 208},
                { desa: 'Banggle', PPM_Perseta_Baru: 266, Pencapain_Akseptor: 271},
                { desa: 'Sawentar', PPM_Perseta_Baru: 387, Pencapain_Akseptor: 395}
              ],
            },
            {
              id: 'bab4-bar-chart11',
              type: 'bar',
              title: 'Keluarga dan Pasangan Usia Subur (PUS) Hasil Pendataan DPPKBP3A',
              xAxisKey: 'desa',
              keys: ['Jumlah_Keluarga', 'PUS'],
              data: [
                { desa: 'Minggirsari', Jumlah_Keluarga: 1255, PUS: 614},
                { desa: 'Gogodeso', Jumlah_Keluarga: 1909, PUS: 818},
                { desa: 'Karangsono', Jumlah_Keluarga: 2073, PUS: 1017},
                { desa: 'Satreyan', Jumlah_Keluarga: 2963, PUS: 1393},
                { desa: 'Kanigoro', Jumlah_Keluarga: 1830, PUS: 783},
                { desa: 'Tlogo', Jumlah_Keluarga: 2267, PUS: 1068},
                { desa: 'Gaprang', Jumlah_Keluarga: 1846, PUS: 901},
                { desa: 'Jatinom', Jumlah_Keluarga: 1837, PUS: 906},
                { desa: 'Kuningan', Jumlah_Keluarga: 1214, PUS: 562},
                { desa: 'Papungan', Jumlah_Keluarga: 2301, PUS: 1144},
                { desa: 'Banggle', Jumlah_Keluarga: 2888, PUS: 1469},
                { desa: 'Sawentar', Jumlah_Keluarga: 4669, PUS: 2275}
              ],
            },
            {
              id: 'bab4-pie-chart3',
              type: 'pie',
              title: 'Persentase Jumlah Pasangan Usia Subur Dari Jenis Keikutan Peserta KB',
              description: 'Pemerintah: 4475, Swasta: 4744',
              data: [
                { name: 'Pemerintah', value: 4475},
                { name: 'Swasta', value: 4744}
              ],
            },
            {
              id: 'bab4-pie-chart4',
              type: 'pie',
              title: 'Jumlah Tempat Peribadatan Menurut Jenisnya',
              description: 'Masjid: 54, Mushola: 264, Gereja Protestan: 4, Pura: 2, Gereja Katolik: 0, Vihara: 0',
              data: [
                { name: 'Gereja Protestan', value: 4},
                { name: 'Masjid', value: 54},
                { name: 'Pura', value: 2},
                { name: 'Mushola', value: 264}
              ],
            },
            {
              id: 'bab4-bar-chart12',
              type: 'bar',
              title: 'Banyaknya Nikah, Talak, Cerai Dan Rujuk Dirinci Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Cerai_Talak', 'Cerai_Gugat'],
              data: [
                { desa: 'Minggirsari', Cerai_Talak: 6, Cerai_Gugat: 5},
                { desa: 'Gogodeso', Cerai_Talak: 2, Cerai_Gugat: 9},
                { desa: 'Karangsono', Cerai_Talak: 4, Cerai_Gugat: 15},
                { desa: 'Satreyan', Cerai_Talak: 3, Cerai_Gugat: 12},
                { desa: 'Kanigoro', Cerai_Talak: 1, Cerai_Gugat: 12},
                { desa: 'Tlogo', Cerai_Talak: 4, Cerai_Gugat: 10},
                { desa: 'Gaprang', Cerai_Talak: 1, Cerai_Gugat: 16},
                { desa: 'Jatinom', Cerai_Talak: 4, Cerai_Gugat: 9},
                { desa: 'Kuningan', Cerai_Talak: 0, Cerai_Gugat: 7},
                { desa: 'Papungan', Cerai_Talak: 1, Cerai_Gugat: 11},
                { desa: 'Banggle', Cerai_Talak: 2, Cerai_Gugat: 17},
                { desa: 'Sawentar', Cerai_Talak: 5, Cerai_Gugat: 31}
              ],
            },
            {
              id: 'bab4-pie-chart4',
              type: 'bar',
              title: 'Banyaknya Pemeluk Agama Menurut Agama',
              xAxisKey: 'agama',
              keys: ['Jumlah_Pemeluk'],
              data: [
                { agama: 'Islam', Jumlah_Pemeluk: 74467},
                { agama: 'Katholik', Jumlah_Pemeluk: 419},
                { agama: 'Kristen Protestan', Jumlah_Pemeluk: 198},
                { agama: 'Hindu', Jumlah_Pemeluk: 235},
                { agama: 'Budha', Jumlah_Pemeluk: 0}
              ],
            },
            {
              id: 'bab4-line',
              type: 'line',
              title: 'Jumlah Jamaah Haji Yang Diberangkatkan Ke Tanah Suci Di Kecamatan Kanigoro Tahun 2020-2024',
              xAxisKey: 'tahun',
              keys: ['jumlah'],       
              data: [
                { tahun: '2020', jumlah: 0},
                { tahun: '2021', jumlah: 0},
                { tahun: '2022', jumlah: 28},
                { tahun: '2023', jumlah: 93},
                { tahun: '2024', jumlah: 62},
              ],
            },
            {
              id: 'tren-kesehatan-line',
              type: 'line',
              title: 'Jumlah Pendonor Darah Menurut Golongan Darah',
              xAxisKey: 'tahun',
              keys: ['A', 'B', 'O', 'AB'],
              data: [
                { tahun: '2020', A: 77, B: 125, O: 158, AB: 23 },
                { tahun: '2021', A: 61, B: 88, O: 109, AB: 13 },
                { tahun: '2022', A: 75, B: 102, O: 109, AB: 23 },
                { tahun: '2023', A: 57, B: 93, O: 124, AB: 24 },
                { tahun: '2024', A: 58, B: 100, O: 123, AB: 13 },
              ],
            },
            {
              id: 'fasilitas-olahraga-stacked',
              type: 'bar',
              title: 'Kondisi Fasilitas Olahraga',
              description: 'Sebaran kondisi fasilitas olahraga di setiap desa.',
              xAxisKey: 'olahraga',
              keys: ['Baik', 'Rusak_Sedang', 'Rusak_Parah', 'Tidak_Ada'], 
              data: [
                { olahraga: 'Sepak Bola', Baik: 9, Rusak_Sedang: 1, Rusak_Parah: 1, Tidak_Ada: 1 },
                { olahraga: 'Bola Voli', Baik: 8, Rusak_Sedang: 0, Rusak_Parah: 1, Tidak_Ada: 3 },
                { olahraga: 'Bulu Tangkis', Baik: 9, Rusak_Sedang: 1, Rusak_Parah: 0, Tidak_Ada: 2 },
                { olahraga: 'Bola Basket', Baik: 1, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 11 },
                { olahraga: 'Tenis Lapangan', Baik: 0, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 12 },
                { olahraga: 'Tenis Meja', Baik: 8, Rusak_Sedang: 0, Rusak_Parah: 1, Tidak_Ada: 3 },
                { olahraga: 'Futsal', Baik: 2, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 10 },
                { olahraga: 'Renang', Baik: 3, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 9 },
                { olahraga: 'Bela Diri', Baik: 2, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 10 },
              ],
            }       
          ],
        },
        'bab5': {
          title: 'BAB 5',
          description: 'Pertanian',
          charts: [
            {
              id: 'tanaman-hortikultura-line',
              type: 'line', 
              title: 'Luas Panen Tanaman Sayuran dan Buah-buahan Semusim Menurut Jenis Tanaman di Kecamatan Kanigoro (ha), 2021-2024 ',
              xAxisKey: 'tahun',
              keys: ['Bawang_Merah', 'Cabai_Rawit', 'Cabai_Besar', 'Melon', 'Kubis'], 
              data: [
                { tahun: '2021', Bawang_Merah: 42, Cabai_Rawit: 98, Cabai_Besar: 0, Melon: 5, Kubis: 0 },
                { tahun: '2022', Bawang_Merah: 43, Cabai_Rawit: 177, Cabai_Besar: 4, Melon: 2, Kubis: 0 },
                { tahun: '2023', Bawang_Merah: 11, Cabai_Rawit: 65, Cabai_Besar: 0, Melon: 0, Kubis: 1 },
                { tahun: '2024', Bawang_Merah: 12, Cabai_Rawit: 36, Cabai_Besar: 0, Melon: 0, Kubis: 0 },
              ],
            },
            {
              id: 'produksi-sayuran-buah-line',
              type: 'line',
              title: 'Tren Produksi Sayuran & Buah (Kuintal)',
              description: 'Fluktuasi hasil produksi Bawang Merah, Cabai Rawit, Buah-buahan, Cabai Besar, dan KUbis (2021-2024).',
              xAxisKey: 'tahun',
              keys: ['Bawang_Merah', 'Cabai_Rawit', 'Buah_Buahan', 'Cabai_Besar', 'Kubis'], 
              data: [
                {tahun: '2021', Bawang_Merah: 4230,Cabai_Rawit: 7618, Buah_Buahan: 1300, Cabai_Besar: 0, Kubis: 0 },
                {tahun: '2022', Bawang_Merah: 3081, Cabai_Rawit: 4005, Buah_Buahan: 750, Cabai_Besar: 79, Kubis: 0 },
                {tahun: '2023', Bawang_Merah: 1190, Cabai_Rawit: 6975, Buah_Buahan: 0, Cabai_Besar: 0, Kubis: 200 },
                {tahun: '2024', Bawang_Merah: 1101, Cabai_Rawit: 440, Buah_Buahan: 0, Cabai_Besar: 0, Kubis: 0 },
              ],
            },
            {
              id: 'produksi-buah-tahunan-area',
              type: 'area', 
              title: 'Dinamika Produksi Buah Tahunan (Kuintal)',
              description: 'Pergeseran dominasi jenis tanaman buah (2021-2024).',
              xAxisKey: 'tahun',
              keys: ['Durian', 'Mangga', 'Pisang', 'Salak', 'Pepaya', 'Nangka'], 
              data: [
                {tahun: '2021', Durian: 13898, Mangga: 9007, Pisang: 5425, Salak: 311, Pepaya: 204, Nangka: 0},
                {tahun: '2022', Durian: 7835, Mangga: 7764, Pisang: 1794, Salak: 188, Pepaya: 177, Nangka: 0 },
                {tahun: '2023', Durian: 1350, Mangga: 2810, Pisang: 14025, Salak: 642, Pepaya: 515, Nangka: 0},
                {tahun: '2024', Durian: 0, Mangga: 0, Pisang: 4000, Salak: 9735, Pepaya: 3700, Nangka: 11420},
              ],
            },
            {
              id: 'luas-lahan-sawah-stacked',
              type: 'bar',
              title: 'Luas Lahan Sawah Irigasi (Hektar)',
              description: 'Total luas lahan sawah berdasarkan intensitas pengairan (Satu kali vs Dua kali).',
              xAxisKey: 'desa',
              keys: ['Irigasi_Satu_Kali', 'Irigasi_Dua_Kali'], 
              data: [
                { desa: 'Minggirsari', Irigasi_Satu_Kali: 32, Irigasi_Dua_Kali: 25 },
                { desa: 'Gogodeso', Irigasi_Satu_Kali: 74, Irigasi_Dua_Kali: 58 },
                { desa: 'Karangsono', Irigasi_Satu_Kali: 72, Irigasi_Dua_Kali: 57 },
                { desa: 'Satreyan', Irigasi_Satu_Kali: 129, Irigasi_Dua_Kali: 103 },
                { desa: 'Kanigoro', Irigasi_Satu_Kali: 67, Irigasi_Dua_Kali: 52 },
                { desa: 'Tlogo', Irigasi_Satu_Kali: 70, Irigasi_Dua_Kali: 56 },
                { desa: 'Gaprang', Irigasi_Satu_Kali: 44, Irigasi_Dua_Kali: 35 },
                { desa: 'Jatinom', Irigasi_Satu_Kali: 35, Irigasi_Dua_Kali: 27 },
                { desa: 'Kuningan', Irigasi_Satu_Kali: 27, Irigasi_Dua_Kali: 21 },
                { desa: 'Papungan', Irigasi_Satu_Kali: 91, Irigasi_Dua_Kali: 55 },
                { desa: 'Banggle', Irigasi_Satu_Kali: 167, Irigasi_Dua_Kali: 79 },
                { desa: 'Sawentar', Irigasi_Satu_Kali: 240, Irigasi_Dua_Kali: 82 },
              ],
            },
            {
              id: 'luas-lahanbukansawah-stacked',
              type: 'bar',
              title: 'Luas Lahan Pertanian Bukan Sawah Per Desa',
              xAxisKey: 'desa',
              keys: ['Kebun', 'Hutan_Rakyat'], 
              data: [
                { desa: 'Minggirsari', Kebun: 32, Hutan_Rakyat: 25 },
                { desa: 'Gogodeso', Kebun: 74, Hutan_Rakyat: 58 },
                { desa: 'Karangsono', Kebun: 72, Hutan_Rakyat: 57 },
                { desa: 'Satreyan', Kebun: 129, Hutan_Rakyat: 103 },
                { desa: 'Kanigoro', Kebun: 67, Hutan_Rakyat: 52 },
                { desa: 'Tlogo', Kebun: 70, Hutan_Rakyat: 56 },
                { desa: 'Gaprang', Kebun: 44, Hutan_Rakyat: 35 },
                { desa: 'Jatinom', Kebun: 35, Hutan_Rakyat: 27 },
                { desa: 'Kuningan', Kebun: 27, Hutan_Rakyat: 21 },
                { desa: 'Papungan', Kebun: 91, Hutan_Rakyat: 55 },
                { desa: 'Banggle', Kebun: 167, Hutan_Rakyat: 79 },
                { desa: 'Sawentar', Kebun: 240, Hutan_Rakyat: 82 },
              ],
            },
            {
              id: 'perbandingan-lahan-desa',
              type: 'bar',
              title: 'Komposisi Penggunaan Lahan per Desa',
              description: 'Perbandingan luas lahan sawah vs lahan bukan sawah (Hektar).',
              xAxisKey: 'desa',
              keys: ['Lahan_Sawah', 'Lahan_Bukan_Sawah'], 
              data: [
                { desa: 'Minggirsari', Lahan_Sawah: 57, Lahan_Bukan_Sawah: 133 },
                { desa: 'Gogodeso', Lahan_Sawah: 133, Lahan_Bukan_Sawah: 189 },
                { desa: 'Karangsono', Lahan_Sawah: 129, Lahan_Bukan_Sawah: 249 },
                { desa: 'Satreyan', Lahan_Sawah: 233, Lahan_Bukan_Sawah: 62 },
                { desa: 'Kanigoro', Lahan_Sawah: 119, Lahan_Bukan_Sawah: 222 },
                { desa: 'Tlogo', Lahan_Sawah: 126, Lahan_Bukan_Sawah: 199 },
                { desa: 'Gaprang', Lahan_Sawah: 79, Lahan_Bukan_Sawah: 137 },
                { desa: 'Jatinom', Lahan_Sawah: 62, Lahan_Bukan_Sawah: 164 },
                { desa: 'Kuningan', Lahan_Sawah: 49, Lahan_Bukan_Sawah: 81 },
                { desa: 'Papungan', Lahan_Sawah: 146, Lahan_Bukan_Sawah: 223 },
                { desa: 'Banggle', Lahan_Sawah: 246, Lahan_Bukan_Sawah: 305 },
                { desa: 'Sawentar', Lahan_Sawah: 322, Lahan_Bukan_Sawah: 566 },
              ],
            },
            {
              id: 'perkebunan-stacked-bar',
              type: 'bar',
              title: 'Luas Areal Perkebunan (Ribu Ha)',
              description: 'Penurunan luas lahan perkebunan didominasi oleh komoditas Kelapa.',
              xAxisKey: 'tahun',
              keys: ['Kelapa', 'Kakao', 'Tebu', 'Tembakau'], 
              data: [
                {tahun: '2023', Kelapa: 0.98, Kakao: 0.06, Tebu: 0.06, Tembakau: 0.02},
                {tahun: '2024', Kelapa: 0.58, Kakao: 0.06, Tebu: 0.06, Tembakau: 0.01 },
              ],
            },
            {
              id: 'tanam-panen-pangan',
              type: 'bar', 
              title: 'Perbandingan Luas Tanam vs Panen (Ha)',
              description: 'Realisasi luas panen dibandingkan dengan luas tanam bahan pangan utama.',
              xAxisKey: 'komoditas',
              keys: ['Luas_Tanam', 'Luas_Panen'], 
              data: [
                {komoditas: 'Padi Sawah', Luas_Tanam: 1982, Luas_Panen: 1324 },
                {komoditas: 'Jagung', Luas_Tanam: 3829, Luas_Panen: 3318 },
                {komoditas: 'Ketela Rambat', Luas_Tanam: 45, Luas_Panen: 72 },
                {komoditas: 'Kacang Tanah', Luas_Tanam: 30, Luas_Panen: 33},
              ],
            },
            {
              id: 'kelas-kelompok-tani-stacked',
              type: 'bar',
              title: 'Klasifikasi Kemampuan Kelompok Tani',
              description: 'Perkembangan kelas kemampuan kelompok tani (Pemula hingga Utama).',
              xAxisKey: 'tahun',
              keys: ['Pemula', 'Lanjut', 'Madya', 'Utama'], 
              data: [
                {tahun: '2020', Pemula: 65, Lanjut: 19, Madya: 0, Utama: 0},
                {tahun: '2021', Pemula: 30, Lanjut: 20, Madya: 0, Utama: 1},
                {tahun: '2022', Pemula: 63, Lanjut: 19, Madya: 0, Utama: 0},
                {tahun: '2023', Pemula: 64, Lanjut: 114, Madya: 11, Utama: 1},
                {tahun: '2024', Pemula: 10, Lanjut: 49, Madya: 0, Utama: 0 },
              ],
            },
            {
              id: 'tren-pemilik-ikan-area',
              type: 'area',
              title: 'Tren Jumlah Pembudidaya Ikan',
              description: 'Pertumbuhan jumlah pemilik kolam ikan tawar (Luas lahan konstan 18 Ha).',
              xAxisKey: 'tahun',
              keys: ['Jumlah_Pemilik'], 
              data: [
                { tahun: '2020', Jumlah_Pemilik: 275 },
                { tahun: '2021', Jumlah_Pemilik: 276 },
                { tahun: '2022', Jumlah_Pemilik: 282 },
                { tahun: '2023', Jumlah_Pemilik: 282 },
                { tahun: '2024', Jumlah_Pemilik: 290 },
              ],
            },
            {
              id: 'bab5-pie-chart1',
              type: 'pie',
              title: 'Populasi Ternak Menurut Desa Di  Kecamatan Kanigoro',
              description: 'Sapi Potong: 7597, Kambing: 19327, Domba: 1079, Sapi Perah: 398',
              data: [
                { name: 'Sapi Potong', value: 7597},
                { name: 'Kambing', value: 19327},
                { name: 'Domba', value: 1079},
                { name: 'Sapi Perah', value: 398}
              ],
            },
            {
              id: 'bab5-pie-chart2',
              type: 'pie',
              title: 'Produksi Telor Menurut Jenis Unggas (Ton)',
              description: 'Ayam Buras: 32.88, Ayam Ras: 1530.74, Itik: 253.94, Entok: 3.09',
              data: [
                { name: 'Ayam Buras', value: 32.88},
                { name: 'Ayam Ras', value: 1530.74},
                { name: 'Itik', value: 253.94},
                { name: 'Entok', value: 3.09}
              ],
            },
          ],
        },
        'bab6': {
          title: 'BAB 6',
          description: 'Pariwisata Transportasi Komunikasi',
          charts: [
            {
              id: 'bts-operator-grouped',
              type: 'bar',
              title: 'Infrastruktur Telekomunikasi Desa',
              description: 'Perbandingan jumlah menara BTS fisik dengan jumlah operator yang aktif.',
              xAxisKey: 'desa',
              keys: ['Menara_BTS', 'Operator'], 
              data: [
                { desa: 'Minggirsari', Menara_BTS: 1, Operator: 2 },
                { desa: 'Gogodeso', Menara_BTS: 1, Operator: 3 },
                { desa: 'Karangsono', Menara_BTS: 1, Operator: 0 }, 
                { desa: 'Satreyan', Menara_BTS: 2, Operator: 1 },
                { desa: 'Kanigoro', Menara_BTS: 3, Operator: 3 },
                { desa: 'Tlogo', Menara_BTS: 1, Operator: 3 },
                { desa: 'Gaprang', Menara_BTS: 2, Operator: 3 },
                { desa: 'Jatinom', Menara_BTS: 1, Operator: 1 },
                { desa: 'Kuningan', Menara_BTS: 3, Operator: 3 },
                { desa: 'Papungan', Menara_BTS: 1, Operator: 1 },
                { desa: 'Banggle', Menara_BTS: 2, Operator: 4 },
                { desa: 'Sawentar', Menara_BTS: 6, Operator: 6 },
              ],
            },
            {
              id: 'distribusi-sinyal-pie',
              type: 'pie',
              title: 'Kualitas Sinyal Seluler & Internet',
              description: 'Persentase desa berdasarkan kekuatan sinyal dan jenis jaringan internet.',
              data: [
                { name: 'Sinyal Sangat Kuat', value: 9}, 
                { name: 'Sinyal Kuat', value: 3},       
              ],
            },
            {
              id: 'objek-wisata-bar',
              type: 'bar',
              title: 'Jumlah Objek Wisata Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Objek_Wisata'], 
              data: [
                { desa: 'Minggirsari', Objek_Wisata: 1},
                { desa: 'Gogodeso', Objek_Wisata: 1},
                { desa: 'Karangsono', Objek_Wisata: 1}, 
                { desa: 'Satreyan', Objek_Wisata: 0},
                { desa: 'Kanigoro', Objek_Wisata: 2},
                { desa: 'Tlogo', Objek_Wisata: 1},
                { desa: 'Gaprang', Objek_Wisata: 1},
                { desa: 'Jatinom', Objek_Wisata: 0},
                { desa: 'Kuningan', Objek_Wisata: 1},
                { desa: 'Papungan', Objek_Wisata: 0},
                { desa: 'Banggle', Objek_Wisata: 0},
                { desa: 'Sawentar', Objek_Wisata: 3},
              ],
            },
            {
              id: 'pie-prasarana',
              type: 'pie',
              title: 'Jenis Prasarana Transportasi',
              description: '100% wilayah menggunakan akses darat.',
              data: [
                { name: 'Darat', value: 12}, 
                { name: 'Air/Laut', value: 0}, 
              ],
            },
          ],
        },
        'bab7': {
          title: 'BAB 7',
          description: 'Perbankan Koperasi Perdagangan',
          charts: [
            {
              id: 'pie-koperasi',
              type: 'pie',
              title: 'Banyaknya Koperasi yang Masih Aktif',
              description: 'Koperasi Unit Desa (KUD): 2, Koperasi Simpan Pinjam (Kospin): 13',
              data: [
                { name: 'KUD', value: 2}, 
                { name: 'Kospin', value: 13}, 
              ],
            },
            {
              id: 'pie-lembaga-keuangan',
              type: 'pie',
              title: 'Banyaknya Sarana Lembaga Keuangan Bank',
              description: 'Bank Umum: 4, Bank Perkreditan Rakyat (BPR): 7',
              data: [
                { name: 'Bank Umum', value: 4}, 
                { name: 'Bank Perkredita', value: 7}, 
              ],
            },
            {
              id: 'pie-wajib-pajak',
              type: 'pie',
              title: 'Wajib Pajak Terdaftar di Kecamatan Kanigoro sd Desember 2024',
              description: 'Orang Pribadi: 3771, Badan: 551, Bendahara: 52',
              data: [
                { name: 'Orang Pribadi', value: 3771}, 
                { name: 'Badan', value: 551}, 
                { name: 'Bendahara', value: 52}
              ],
            },
            {
              id: 'bab7-bar-chart1',
              type: 'bar',
              title: 'Banyaknya Sarana Perdagangan Menurut Desa dan Jenis Sarana Perdagangan',
              xAxisKey: 'desa',
              keys: ['Kelompok_Pertokoan', 'Pasar', 'Supermarket'],
              data: [
                { desa: 'Minggirsari', Kelompok_Pertokoan: 0, Pasar: 0, Supermarket: 0},
                { desa: 'Gogodeso', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 3},
                { desa: 'Karangsono', Kelompok_Pertokoan: 1, Pasar: 0, Supermarket: 1},
                { desa: 'Satreyan', Kelompok_Pertokoan: 2, Pasar: 1, Supermarket: 1},
                { desa: 'Kanigoro', Kelompok_Pertokoan: 9, Pasar: 0, Supermarket: 9},
                { desa: 'Tlogo', Kelompok_Pertokoan: 4, Pasar: 0, Supermarket: 4},
                { desa: 'Gaprang', Kelompok_Pertokoan: 5, Pasar: 0, Supermarket: 5},
                { desa: 'Jatinom', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2},
                { desa: 'Kuningan', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2},
                { desa: 'Papungan', Kelompok_Pertokoan: 2, Pasar: 0, Supermarket: 1},
                { desa: 'Banggle', Kelompok_Pertokoan: 2, Pasar: 0, Supermarket: 2},
                { desa: 'Sawentar', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2}
              ],
            },
          ],
        },        
      },
    },
    sutojayan: {
      title: 'Kecamatan Sutojayan',
      color: 'blue', 
      icon: <Book />,
      subCategories: {
        'bab1': {
          title: 'BAB 1',
          description: 'Geografi',
          charts: [
            {
              id: 'bab1-bar-chart1',
              type: 'bar',
              title: 'Status Pemerintahan Desa/Kelurahan',
              xAxisKey: 'desa',
              keys: ['Desa', 'Kelurahan'],
              data: [
                { desa: 'Pandanarum', Desa: 1},
                { desa: 'Kedungbunder', Kelurahan: 1},
                { desa: 'Sutojayan', Kelurahan: 1},
                { desa: 'Bacem', Desa: 1},
                { desa: 'Sumberjo', Desa: 1},
                { desa: 'Sukorejo', Kelurahan: 1},
                { desa: 'Kalipang', Kelurahan: 1},
                { desa: 'Kembangarum', Kelurahan: 1},
                { desa: 'Jingglong', Kelurahan: 1},
                { desa: 'Kaulon', Desa: 1},
                { desa: 'Jegu', Kelurahan: 1}
              ],
            },
            {
              id: 'bab1-bar-chart2',
              type: 'bar',
              title: 'Jarak ke Ibukota Kecamatan dan Ibukota Kabupaten/Kota (km)',
              xAxisKey: 'desa',
              keys: ['Jarak_ke_Ibukota_Kecamatan', 'Jarak_ke_Ibukota_Kab_Kota'],
              data: [
                { desa: 'Pandanarum', Jarak_ke_Ibukota_Kecamatan: 4, Jarak_ke_Ibukota_Kab_Kota: 9},
                { desa: 'Kedungbunder', Jarak_ke_Ibukota_Kecamatan: 19, Jarak_ke_Ibukota_Kab_Kota: 8},
                { desa: 'Sutojayan', Jarak_ke_Ibukota_Kecamatan: 1, Jarak_ke_Ibukota_Kab_Kota: 6},
                { desa: 'Bacem', Jarak_ke_Ibukota_Kecamatan: 5, Jarak_ke_Ibukota_Kab_Kota: 10},
                { desa: 'Sumberjo', Jarak_ke_Ibukota_Kecamatan: 4, Jarak_ke_Ibukota_Kab_Kota: 9},
                { desa: 'Sukorejo', Jarak_ke_Ibukota_Kecamatan: 3, Jarak_ke_Ibukota_Kab_Kota: 6},
                { desa: 'Kalipang', Jarak_ke_Ibukota_Kecamatan: 1, Jarak_ke_Ibukota_Kab_Kota: 3},
                { desa: 'Kembangarum', Jarak_ke_Ibukota_Kecamatan: 1, Jarak_ke_Ibukota_Kab_Kota: 5},
                { desa: 'Jingglong', Jarak_ke_Ibukota_Kecamatan: 3, Jarak_ke_Ibukota_Kab_Kota: 6},
                { desa: 'Kaulon', Jarak_ke_Ibukota_Kecamatan: 9, Jarak_ke_Ibukota_Kab_Kota: 11},
                { desa: 'Jegu', Jarak_ke_Ibukota_Kecamatan: 4, Jarak_ke_Ibukota_Kab_Kota: 6}
              ],
            },
            {
              id: 'bab1-pie-chart1',
              type: 'pie',
              title: 'Letak Wilayah (Jumlah desa adalah 12)',
              description: 'Karena tidak ada desa yang berada dalam kawasan hutan atau di tepi kawasan hutan, maka seluruh desa berada di luar kawasan hutan.',
              data: [
                { name: 'Dalam Kawasan Hutan', value: 0, color: '#0053d9ff' },
                { name: 'Tepi Kawasan Hutan', value: 7, color: '#10b981' },
                { name: 'Luar Kawasan Hutan', value: 4, color: '#ffd793ff' }
              ],
            },
            {
              id: 'bab1-bar-chart3',
              type: 'bar',
              title: 'Letak Topografi Wilayah Menurut Desa/Kelurahan',
              xAxisKey: 'desa',
              keys: ['Lereng', 'Dataran'],
              data: [
                { desa: 'Pandanarum', Lereng: 1},
                { desa: 'Kedungbunder', Dataran: 1},
                { desa: 'Sutojayan', Dataran: 1},
                { desa: 'Bacem', Lereng: 1},
                { desa: 'Sumberjo', Dataran: 1},
                { desa: 'Sukorejo', Dataran: 1},
                { desa: 'Kalipang', Dataran: 1},
                { desa: 'Kembangarum', Dataran: 1},
                { desa: 'Jingglong', Dataran: 1},
                { desa: 'Kaulon', Lereng: 1},
                { desa: 'Jegu', Dataran: 1}
              ],
            },
            {
              id: 'bab1-bar-chart3',
              type: 'bar',
              title: 'Hari Hujan (Hari) dan Curah Hujan (Mm) Januari-Desember 2024',
              xAxisKey: 'bulan',
              keys: ['Hari_Hujan', 'Curah_Hujan'],
              data: [
                { bulan: 'Januari', Hari_Hujan: 29, Curah_Hujan: 202},
                { bulan: 'Februari', Hari_Hujan: 43, Curah_Hujan: 839},
                { bulan: 'Maret', Hari_Hujan: 26, Curah_Hujan: 561},
                { bulan: 'April', Hari_Hujan: 18, Curah_Hujan: 248},
                { bulan: 'Mei', Hari_Hujan: 9, Curah_Hujan: 33},
                { bulan: 'Juni', Hari_Hujan: 13, Curah_Hujan: 98},
                { bulan: 'Juli', Hari_Hujan: 14, Curah_Hujan: 247},
                { bulan: 'Agustus', Hari_Hujan: 0, Curah_Hujan: 0},
                { bulan: 'September', Hari_Hujan: 0, Curah_Hujan: 0},
                { bulan: 'Oktober', Hari_Hujan: 0, Curah_Hujan: 0},
                { bulan: 'November', Hari_Hujan: 10, Curah_Hujan: 89},
                { bulan: 'Desember', Hari_Hujan: 14, Curah_Hujan: 181}
              ],
            },
            {
              id: 'bab1-bar-chart4',
              type: 'bar',
              title: 'Luas Total Area Kecamatan Sutojayan (km²)',
              xAxisKey: 'desa',
              keys: ['Luas'],
              data: [
                { desa: 'Pandanarum', Luas: 3.58 },
                { desa: 'Kedungbunder', Luas: 7.58 },
                { desa: 'Sutojayan', Luas: 3.87 },
                { desa: 'Bacem', Luas: 4.18 },
                { desa: 'Sumberjo', Luas: 1.96 },
                { desa: 'Sukorejo', Luas: 3.53 },
                { desa: 'Kalipang', Luas: 2.44 },
                { desa: 'Kembangarum', Luas: 5.43 },
                { desa: 'Jingglong', Luas: 7.30 },
                { desa: 'Kaulon', Luas: 1.06 },
                { desa: 'Jegu', Luas: 3.31 }
              ],
            },
            {
              id: 'bab1-pie-chart2',
              type: 'pie',
              title: 'Persentase Luas Wilayah per Desa',
              data: [
                { name: 'Pandanarum', value: 8.09 },
                { name: 'Kedungbunder', value: 17.13 },
                { name: 'Sutojayan', value: 8.75 },
                { name: 'Bacem', value: 9.45 },
                { name: 'Sumberjo', value: 4.43 },
                { name: 'Sukorejo', value: 7.98 },
                { name: 'Kalipang', value: 5.52 },
                { name: 'Kembangarum', value: 12.27 },
                { name: 'Jingglong', value: 16.50 },
                { name: 'Kaulon', value: 2.40 },
                { name: 'Jegu', value: 7.48 }
              ],
            },
          ],
        },
        'bab2': {
          title: 'BAB 2',
          description: 'Pemerintahan',
          charts: [
            {
              id: 'bab2-bar-chart1',
              type: 'bar',
              title: 'Banyaknya Dusun, RW, dan RT Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Dusun', 'RW', 'RT'],
              data: [
                { desa: 'Pandanarum', Dusun: 3, RW: 10, RT: 44 },
                { desa: 'Kedungbunder', Dusun: 2, RW: 4, RT: 14 },
                { desa: 'Sutojayan', Dusun: 3, RW: 10, RT: 31 },
                { desa: 'Bacem', Dusun: 2, RW: 12, RT: 47 },
                { desa: 'Sumberjo', Dusun: 1, RW: 2, RT: 7 },
                { desa: 'Sukorejo', Dusun: 2, RW: 5, RT: 13 },
                { desa: 'Kalipang', Dusun: 3, RW: 7, RT: 38 },
                { desa: 'Kembangarum', Dusun: 2, RW: 3, RT: 9 },
                { desa: 'Jingglong', Dusun: 2, RW: 5, RT: 25 },
                { desa: 'Kaulon', Dusun: 2, RW: 3, RT: 18 },
                { desa: 'Jegu', Dusun: 3, RW: 7, RT: 17 }
              ],
            },
            {
              id: 'bab2-bar-chart2',
              type: 'bar',
              title: 'Jumlah Pengurus BPD/LMK Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Pengurus_BPD_LMK'],
              data: [
                { desa: 'Pandanarum', Pengurus_BPD_LMK: 9 },
                { desa: 'Kedungbunder', Pengurus_BPD_LMK: 0 },
                { desa: 'Sutojayan', Pengurus_BPD_LMK: 0 },
                { desa: 'Bacem', Pengurus_BPD_LMK: 9 },
                { desa: 'Sumberjo', Pengurus_BPD_LMK: 5 },
                { desa: 'Sukorejo', Pengurus_BPD_LMK: 0 },
                { desa: 'Kalipang', Pengurus_BPD_LMK: 0 },
                { desa: 'Kembangarum', Pengurus_BPD_LMK: 0 },
                { desa: 'Jingglong', Pengurus_BPD_LMK: 0 },
                { desa: 'Kaulon', Pengurus_BPD_LMK: 7 },
                { desa: 'Jegu', Pengurus_BPD_LMK: 0 }
              ],
            },
            {
              id: 'bab2-pie-chart1',
              type: 'pie',
              title: 'Jumlah Pegawai Negeri Sipil (PNS) Berdasarkan Jenis Kelamin',
              data: [
                { name: 'Laki-laki', value: 6, color: '#0053d9ff' },
                { name: 'Perempuan', value: 6, color: '#ffd793ff' }
              ],
            },
          ],
        },  
        'bab3': {
          title: 'BAB 3',
          description: 'Kependukan',
          charts: [
            {
              id: 'bab3-bar-chart1',
              type: 'bar',
              title: 'Jumlah Penduduk Menurut Jenis Kelamin dan Desa',
              xAxisKey: 'desa',
              keys: ['laki_laki', 'perempuan'],
              data: [
                { desa: 'Pandanarum', laki_laki: 3676, perempuan: 3602 },
                { desa: 'Kedungbunder', laki_laki: 2047, perempuan: 2095 },
                { desa: 'Sutojayan', laki_laki: 3567, perempuan: 3641 },
                { desa: 'Bacem', laki_laki: 3300, perempuan: 3344 },
                { desa: 'Sumberjo', laki_laki: 671, perempuan: 646 },
                { desa: 'Sukorejo', laki_laki: 1771, perempuan: 1845 },
                { desa: 'Kalipang', laki_laki: 3985, perempuan: 4169 },
                { desa: 'Kembangarum', laki_laki: 965, perempuan: 999 },
                { desa: 'Jingglong', laki_laki: 3116, perempuan: 3007 },
                { desa: 'Kaulon', laki_laki: 1096, perempuan: 1125 },
                { desa: 'Jegu', laki_laki: 1977, perempuan: 1979 }
              ],
            },
            {
              id: 'bab3-pie-chart1',
              type: 'pie',
              title: 'Persentase Penduduk Menurut Desa',
              data: [
                { name: 'Pandanarum', value: 13.83 },
                { name: 'Kedungbunder', value: 7.87 },
                { name: 'Sutojayan', value: 13.70 },
                { name: 'Bacem', value: 12.63 },
                { name: 'Sumberjo', value: 2.50 },
                { name: 'Sukorejo', value: 6.87 },
                { name: 'Kalipang', value: 15.50 },
                { name: 'Kembangarum', value: 3.73 },
                { name: 'Jingglong', value: 11.64 },
                { name: 'Kaulon', value: 4.22 },
                { name: 'Jegu', value: 7.52 }
              ],
            },
            {
              id: 'tren-populasi-line',
              type: 'bar',
              title: 'Tren Pertumbuhan Penduduk (2020-2024)',
              description: 'Perkembangan jumlah penduduk Laki-laki dan Perempuan per tahun.',
              xAxisKey: 'tahun',
              keys: ['LakiLaki', 'Perempuan'], 
              data: [
                {tahun: '2020', LakiLaki: 26860, Perempuan: 26786 },
                {tahun: '2021', LakiLaki: 25829, Perempuan: 25975 },
                {tahun: '2022', LakiLaki: 25793, Perempuan: 26064 },
                {tahun: '2023', LakiLaki: 26011, Perempuan: 26268 },
                {tahun: '2024', LakiLaki: 26171, Perempuan: 26452 },
              ],
            },
            {
              id: 'bab3-line-chart1',
              type: 'line',
              title: 'Penduduk Menurut Kelompok Umur',
              xAxisKey: 'kelompok_umur',
              keys: ['Laki_Laki', 'Perempuan'],
              data: [
                { kelompok_umur: '0-4', Laki_Laki: 1211, Perempuan: 1157 },
                { kelompok_umur: '5-9', Laki_Laki: 1633, Perempuan: 1524 },
                { kelompok_umur: '10-14', Laki_Laki: 1918, Perempuan: 1844 },
                { kelompok_umur: '15-19', Laki_Laki: 1956, Perempuan: 1699 },
                { kelompok_umur: '20-24', Laki_Laki: 1893, Perempuan: 1820 },
                { kelompok_umur: '25-29', Laki_Laki: 1739, Perempuan: 1747 },
                { kelompok_umur: '30-34', Laki_Laki: 1651, Perempuan: 1611 },
                { kelompok_umur: '35-39', Laki_Laki: 1796, Perempuan: 1825 },
                { kelompok_umur: '40-44', Laki_Laki: 2096, Perempuan: 2216 },
                { kelompok_umur: '45-49', Laki_Laki: 2013, Perempuan: 2039 },
                { kelompok_umur: '50-54', Laki_Laki: 1986, Perempuan: 2165 },
                { kelompok_umur: '55-59', Laki_Laki: 1829, Perempuan: 1957 },
                { kelompok_umur: '60-64', Laki_Laki: 1470, Perempuan: 1562 },
                { kelompok_umur: '65-69', Laki_Laki: 1099, Perempuan: 1232 },
                { kelompok_umur: '70-75', Laki_Laki: 830, Perempuan: 872 },
                { kelompok_umur: '75+', Laki_Laki: 1051, Perempuan: 1182 }
              ],
            },  
          ],
        },
        'bab4': {
          title: 'BAB 4',
          description: 'Sosial dan Kesejahteraan',
          charts: [
            {
              id: 'bab4-line-chart1',
              type: 'bar', 
              title: 'Jumlah Sekolah Menurut Tingkat Pendidikan',
              description: 'Data jumlah sekolah konstan dari tahun 2022 hingga 2024.',
              xAxisKey: 'Tingkat_Pendidikan',
              keys: ['Tahun_2022', 'Tahun_2023', 'Tahun_2024'],
              data: [
                { Tingkat_Pendidikan: 'SD', Tahun_2022: 11, Tahun_2023: 11, Tahun_2024: 11 },
                { Tingkat_Pendidikan: 'MI', Tahun_2022: 6, Tahun_2023: 6, Tahun_2024: 6 },
                { Tingkat_Pendidikan: 'SMP', Tahun_2022: 3, Tahun_2023: 3, Tahun_2024: 3 },
                { Tingkat_Pendidikan: 'MTs', Tahun_2022: 3, Tahun_2023: 3, Tahun_2024: 3 },
                { Tingkat_Pendidikan: 'SMA', Tahun_2022: 1, Tahun_2023: 1, Tahun_2024: 1 },
                { Tingkat_Pendidikan: 'SMK', Tahun_2022: 2, Tahun_2023: 2, Tahun_2024: 2 },
                { Tingkat_Pendidikan: 'MA', Tahun_2022: 2, Tahun_2023: 2, Tahun_2024: 2 },
                { Tingkat_Pendidikan: 'Perguruan Tinggi', Tahun_2022: 0, Tahun_2023: 0, Tahun_2024: 0 }
              ],
            },
            {
              id: 'bab4-bar-chart2',
              type: 'bar',
              title: 'Jumlah Sekolah Negeri vs Swasta',
              xAxisKey: 'Tingkat_Pendidikan',
              keys: ['Negeri', 'Swasta'],
              data: [
                { Tingkat_Pendidikan: 'TK', Negeri: 0, Swasta: 32 },
                { Tingkat_Pendidikan: 'RA', Negeri: 0, Swasta: 4 },
                { Tingkat_Pendidikan: 'SD', Negeri: 25, Swasta: 1 },
                { Tingkat_Pendidikan: 'MI', Negeri: 0, Swasta: 8 },
                { Tingkat_Pendidikan: 'SMP', Negeri: 3, Swasta: 1 },
                { Tingkat_Pendidikan: 'MTs', Negeri: 0, Swasta: 3 },
                { Tingkat_Pendidikan: 'SMA', Negeri: 1, Swasta: 0 },
                { Tingkat_Pendidikan: 'SMK', Negeri: 0, Swasta: 2 },
                { Tingkat_Pendidikan: 'MA', Negeri: 0, Swasta: 2 }
              ],
            },
            {
              id: 'bab4-bar-chart3',
              type: 'bar',
              title: 'Jumlah Guru Menurut Tingkat Pendidikan',
              xAxisKey: 'Tingkat_Pendidikan',
              keys: ['Negeri', 'Swasta'],
              data: [
                { Tingkat_Pendidikan: 'TK', Negeri: 0, Swasta: 119 },
                { Tingkat_Pendidikan: 'RA', Negeri: 0, Swasta: 12 },
                { Tingkat_Pendidikan: 'SD', Negeri: 251, Swasta: 5 },
                { Tingkat_Pendidikan: 'MI', Negeri: 0, Swasta: 93 },
                { Tingkat_Pendidikan: 'SMP', Negeri: 130, Swasta: 68 },
                { Tingkat_Pendidikan: 'MTs', Negeri: 0, Swasta: 117 },
                { Tingkat_Pendidikan: 'SMA', Negeri: 49, Swasta: 0 },
                { Tingkat_Pendidikan: 'SMK', Negeri: 0, Swasta: 20 },
                { Tingkat_Pendidikan: 'MA', Negeri: 1, Swasta: 26 }
              ],
            },
            {
              id: 'bab4-bar-chart5',
              type: 'bar',
              title: 'Jumlah Murid Menurut Tingkat Pendidikan',
              xAxisKey: 'Tingkat_Pendidikan',
              keys: ['Negeri', 'Swasta'],
              data: [
                { Tingkat_Pendidikan: 'TK', Negeri: 0, Swasta: 1077 },
                { Tingkat_Pendidikan: 'RA', Negeri: 0, Swasta: 202 },
                { Tingkat_Pendidikan: 'SD', Negeri: 2290, Swasta: 39 },
                { Tingkat_Pendidikan: 'MI', Negeri: 0, Swasta: 1480 },
                { Tingkat_Pendidikan: 'SMP', Negeri: 2030, Swasta: 55 },
                { Tingkat_Pendidikan: 'MTs', Negeri: 0, Swasta: 1723 },
                { Tingkat_Pendidikan: 'SMA', Negeri: 1073, Swasta: 0 },
                { Tingkat_Pendidikan: 'SMK', Negeri: 0, Swasta: 244 },
                { Tingkat_Pendidikan: 'MA', Negeri: 0, Swasta: 280 }
              ],
            },
            {
              id: 'fasilitas-kesehatan-bar',
              type: 'bar',
              title: 'Perbandingan Sarana Kesehatan',
              xAxisKey: 'tahun',
              keys: ['RumahSakit', 'Puskesmas', 'Apotek'],
              data: [
                { tahun: '2022', RumahSakit: 0, Puskesmas: 1, Apotek: 0 },
                { tahun: '2023', RumahSakit: 0, Puskesmas: 1, Apotek: 3 },
                { tahun: '2024', RumahSakit: 1, Puskesmas: 1, Apotek: 4 }
              ],
            },
            {
              id: 'bab4-bar-chart5',
              type: 'bar',
              title: 'Banyaknya Warga Penderita Kekurangan Gizi Menurut Desa (2024)',
              xAxisKey: 'desa',
              keys: ['Tahun_2024'],
              data: [
                { desa: 'Pandanarum', Tahun_2024: 18 },
                { desa: 'Kedungbunder', Tahun_2024: 6 },
                { desa: 'Sutojayan', Tahun_2024: 12 },
                { desa: 'Bacem', Tahun_2024: 13 },
                { desa: 'Sumberjo', Tahun_2024: 5 },
                { desa: 'Sukorejo', Tahun_2024: 6 },
                { desa: 'Kalipang', Tahun_2024: 28 },
                { desa: 'Kembangarum', Tahun_2024: 2 },
                { desa: 'Jingglong', Tahun_2024: 19 },
                { desa: 'Kaulon', Tahun_2024: 4 },
                { desa: 'Jegu', Tahun_2024: 11 }
              ],
            },
            {
              id: 'bab4-bar-chart6',
              type: 'bar',
              title: 'Jumlah Tenaga Kesehatan Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Dokter_Umum', 'Dokter_Gigi', 'Perawat', 'Bidan'],
              data: [
                { desa: 'Pandanarum', Dokter_Umum: 12, Dokter_Gigi: 1, Perawat: 61, Bidan: 16 },
                { desa: 'Kedungbunder', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 0, Bidan: 1 },
                { desa: 'Sutojayan', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 0, Bidan: 1 },
                { desa: 'Bacem', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 3, Bidan: 6 },
                { desa: 'Sumberjo', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 1, Bidan: 0 },
                { desa: 'Sukorejo', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 1, Bidan: 1 },
                { desa: 'Kalipang', Dokter_Umum: 5, Dokter_Gigi: 1, Perawat: 2, Bidan: 2 },
                { desa: 'Kembangarum', Dokter_Umum: 8, Dokter_Gigi: 1, Perawat: 21, Bidan: 22 },
                { desa: 'Jingglong', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 1, Bidan: 1 },
                { desa: 'Kaulon', Dokter_Umum: 1, Dokter_Gigi: 0, Perawat: 0, Bidan: 2 },
                { desa: 'Jegu', Dokter_Umum: 0, Dokter_Gigi: 0, Perawat: 1, Bidan: 0 }
              ],
            },
            {
              id: 'bab4-pie-chart1',
              type: 'pie',
              title: 'PUS dan Peserta KB di Kecamatan Sutojayan Tahun 2024',
              description: 'Total PUS: 7.522, PUS Ikut KB: 5.243, PAMKEJ: 1.809, PA MANDIRI: 3.049',
              data: [
                { name: 'Jumlah PUS', value: 7522 },
                { name: 'PUS Yang Ikut KB', value: 5243 },
                { name: 'PAMKEJ', value: 1809 },
                { name: 'PA MANDIRI', value: 3049 }
              ],
            },
            {
              id: 'bab4-bar-chart6',
              type: 'bar',
              title: 'Jumlah Peserta KB Aktif Menurut Desa dan Metode Kontrasepsi',
              description: 'Metode Kontrasepsi Jangka Panjang (IUD, MOP, MOW, IMPLANT)',
              xAxisKey: 'desa',
              keys: ['IUD', 'MOP', 'MOW', 'IMPLANT'],
              data: [
                { desa: 'Pandanarum', IUD: 280, MOP: 3, MOW: 28, IMPLANT: 84 },
                { desa: 'Kedungbunder', IUD: 234, MOP: 2, MOW: 26, IMPLANT: 86 },
                { desa: 'Sutojayan', IUD: 102, MOP: 4, MOW: 24, IMPLANT: 92 },
                { desa: 'Bacem', IUD: 267, MOP: 1, MOW: 20, IMPLANT: 82 },
                { desa: 'Sumberjo', IUD: 214, MOP: 1, MOW: 21, IMPLANT: 34 },
                { desa: 'Sukorejo', IUD: 254, MOP: 1, MOW: 22, IMPLANT: 68 },
                { desa: 'Kalipang', IUD: 210, MOP: 2, MOW: 23, IMPLANT: 110 },
                { desa: 'Kembangarum', IUD: 212, MOP: 1, MOW: 26, IMPLANT: 43 },
                { desa: 'Jingglong', IUD: 114, MOP: 3, MOW: 26, IMPLANT: 94 },
                { desa: 'Kaulon', IUD: 256, MOP: 1, MOW: 21, IMPLANT: 52 },
                { desa: 'Jegu', IUD: 67, MOP: 2, MOW: 22, IMPLANT: 48 }
              ],
            },
            {
              id: 'bab4-bar-chart7',
              type: 'bar',
              title: 'Kelahiran dan Kematian Bayi Dirinci Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Kelahiran', 'Kematian'],
              data: [
                { desa: 'Pandanarum', Kelahiran: 67, Kematian: 0 },
                { desa: 'Kedungbunder', Kelahiran: 38, Kematian: 0 },
                { desa: 'Sutojayan', Kelahiran: 51, Kematian: 3 },
                { desa: 'Bacem', Kelahiran: 50, Kematian: 3 },
                { desa: 'Sumberjo', Kelahiran: 12, Kematian: 0 },
                { desa: 'Sukorejo', Kelahiran: 25, Kematian: 0 },
                { desa: 'Kalipang', Kelahiran: 72, Kematian: 1 },
                { desa: 'Kembangarum', Kelahiran: 20, Kematian: 0 },
                { desa: 'Jingglong', Kelahiran: 47, Kematian: 0 },
                { desa: 'Kaulon', Kelahiran: 22, Kematian: 0 },
                { desa: 'Jegu', Kelahiran: 37, Kematian: 2 }
              ],
            },
            {
              id: 'bab4-bar-chart8',
              type: 'bar',
              title: 'Banyaknya Persalinan Menurut Penolong Persalinan dan Desa',
              xAxisKey: 'desa',
              keys: ['Dokter', 'Bidan'],
              data: [
                { desa: 'Pandanarum', Dokter: 42, Bidan: 25 },
                { desa: 'Kedungbunder', Dokter: 32, Bidan: 6 },
                { desa: 'Sutojayan', Dokter: 36, Bidan: 15 },
                { desa: 'Bacem', Dokter: 32, Bidan: 18 },
                { desa: 'Sumberjo', Dokter: 9, Bidan: 3 },
                { desa: 'Sukorejo', Dokter: 18, Bidan: 7 },
                { desa: 'Kalipang', Dokter: 64, Bidan: 8 },
                { desa: 'Kembangarum', Dokter: 18, Bidan: 2 },
                { desa: 'Jingglong', Dokter: 37, Bidan: 10 },
                { desa: 'Kaulon', Dokter: 21, Bidan: 1 },
                { desa: 'Jegu', Dokter: 30, Bidan: 7 }
              ],
            },
            {
              id: 'bab4-bar-chart9',
              type: 'bar',
              title: 'Banyaknya Persalinan Menurut Tempat Persalinan dan Desa',
              xAxisKey: 'desa',
              keys: ['RS', 'Puskesmas', 'Klinik'],
              data: [
                { desa: 'Pandanarum', RS: 42, Puskesmas: 25, Klinik: 25 },
                { desa: 'Kedungbunder', RS: 32, Puskesmas: 6, Klinik: 6 },
                { desa: 'Sutojayan', RS: 36, Puskesmas: 15, Klinik: 15 },
                { desa: 'Bacem', RS: 32, Puskesmas: 18, Klinik: 18 },
                { desa: 'Sumberjo', RS: 9, Puskesmas: 3, Klinik: 3 },
                { desa: 'Sukorejo', RS: 18, Puskesmas: 7, Klinik: 7 },
                { desa: 'Kalipang', RS: 64, Puskesmas: 8, Klinik: 8 },
                { desa: 'Kembangarum', RS: 18, Puskesmas: 2, Klinik: 2 },
                { desa: 'Jingglong', RS: 37, Puskesmas: 10, Klinik: 10 },
                { desa: 'Kaulon', RS: 21, Puskesmas: 1, Klinik: 1 },
                { desa: 'Jegu', RS: 30, Puskesmas: 7, Klinik: 7 }
              ],
            },
            {
              id: 'bab4-pie-chart2',
              type: 'pie',
              title: 'Jenis Kelamin Bayi Yang Lahir',
              description: 'Laki-laki: 249, Perempuan: 192',
              data: [
                { name: 'Laki-laki', value: 249},
                { name: 'Perempuan', value: 192}
              ],
            },
            {
              id: 'tren-kesehatan-line',
              type: 'line',
              title: 'Tren Kesehatan Ibu & Anak (2021-2024)',
              xAxisKey: 'tahun',
              keys: ['Jumlah_Balita', 'Kelompok_Timbang', 'Total_Bkia'],
              data: [
                { tahun: '2021', Jumlah_Balita: 2753, Kelompok_Timbang: 2284, Total_Bkia: 3669 },
                { tahun: '2022', Jumlah_Balita: 2731, Kelompok_Timbang: 2437, Total_Bkia: 3846 },
                { tahun: '2023', Jumlah_Balita: 2846, Kelompok_Timbang: 2284, Total_Bkia: 3927 },
                { tahun: '2024', Jumlah_Balita: 2584, Kelompok_Timbang: 2437, Total_Bkia: 3535 },
              ],
            },
            {
              id: 'bab4-bar-chart10',
              type: 'bar',
              title: 'Jumlah Pasien Umum dan BPJS di Puskesmas per Bulan (2024)',
              xAxisKey: 'bulan',
              keys: ['umum', 'BPJS'],
              data: [
                { bulan: 'Januari', umum: 1324, BPJS: 1796 },
                { bulan: 'Februari', umum: 1237, BPJS: 1478 },
                { bulan: 'Maret', umum: 1234, BPJS: 1618 },
                { bulan: 'April', umum: 1203, BPJS: 1581 },
                { bulan: 'Mei', umum: 1390, BPJS: 1683 },
                { bulan: 'Juni', umum: 1438, BPJS: 1562 },
                { bulan: 'Juli', umum: 1578, BPJS: 1554 },
                { bulan: 'Agustus', umum: 1188, BPJS: 1729 },
                { bulan: 'September', umum: 1664, BPJS: 2121 },
                { bulan: 'Oktober', umum: 1540, BPJS: 2116 },
                { bulan: 'November', umum: 1449, BPJS: 1869 },
                { bulan: 'Desember', umum: 1726, BPJS: 1742 }
              ],
            },
            {
              id: 'persentase-kinerja-kb',
              type: 'area',
              title: 'Tingkat Capaian Akseptor Baru (%)',
              description: 'Fluktuasi persentase keberhasilan pencapaian akseptor KB.',
              xAxisKey: 'tahun',
              keys: ['persentase'],
              data: [
                { tahun: '2020', persentase: 102 },
                { tahun: '2021', persentase: 114 },
                { tahun: '2022', persentase: 120 },
                { tahun: '2023', persentase: 100 },
                { tahun: '2024', persentase: 129.44 },
              ],
            },
            {
              id: 'target-vs-realisasi-kb',
              type: 'bar',
              title: 'Target vs Realisasi Akseptor KB Baru',
              description: 'Perbandingan target PPM dengan realisasi pencapaian akseptor di lapangan.',
              xAxisKey: 'tahun',
              keys: ['Target_PPM', 'Realisasi'],
              data: [
                { tahun: '2020', Target_PPM: 1549, Realisasi: 1579 },
                { tahun: '2021', Target_PPM: 1697, Realisasi: 1932 },
                { tahun: '2022', Target_PPM: 1326, Realisasi: 1596 },
                { tahun: '2023', Target_PPM: 1442, Realisasi: 1442 },
                { tahun: '2024', Target_PPM: 1250, Realisasi: 1618 },
              ],
            },
            {
              id: 'bab4-bar-chart11',
              type: 'bar',
              title: 'Pencapaian PPM Peserta Baru dan Akseptor KB Menurut Desa',
              xAxisKey: 'desa',
              keys: ['PPM_Peserta_Baru', 'Pencapaian_Akseptor'],
              data: [
                { desa: 'Pandanarum', PPM_Peserta_Baru: 172, Pencapaian_Akseptor: 214 },
                { desa: 'Kedungbunder', PPM_Peserta_Baru: 93, Pencapaian_Akseptor: 118 },
                { desa: 'Sutojayan', PPM_Peserta_Baru: 167, Pencapaian_Akseptor: 186 },
                { desa: 'Bacem', PPM_Peserta_Baru: 239, Pencapaian_Akseptor: 283 },
                { desa: 'Sumberjo', PPM_Peserta_Baru: 50, Pencapaian_Akseptor: 59 },
                { desa: 'Sukorejo', PPM_Peserta_Baru: 93, Pencapaian_Akseptor: 115 },
                { desa: 'Kalipang', PPM_Peserta_Baru: 97, Pencapaian_Akseptor: 190 },
                { desa: 'Kembangarum', PPM_Peserta_Baru: 78, Pencapaian_Akseptor: 105 },
                { desa: 'Jingglong', PPM_Peserta_Baru: 132, Pencapaian_Akseptor: 153 },
                { desa: 'Kaulon', PPM_Peserta_Baru: 38, Pencapaian_Akseptor: 79 },
                { desa: 'Jegu', PPM_Peserta_Baru: 91, Pencapaian_Akseptor: 116 }
              ],
            },
            {
              id: 'bab4-bar-chart12',
              type: 'bar',
              title: 'Keluarga dan Pasangan Usia Subur (PUS) Hasil Pendataan DPPKBP3A',
              xAxisKey: 'desa',
              keys: ['Jumlah_Keluarga', 'PUS'],
              data: [
                { desa: 'Pandanarum', Jumlah_Keluarga: 2339, PUS: 1018 },
                { desa: 'Kedungbunder', Jumlah_Keluarga: 1417, PUS: 651 },
                { desa: 'Sutojayan', Jumlah_Keluarga: 2031, PUS: 880 },
                { desa: 'Bacem', Jumlah_Keluarga: 2360, PUS: 1055 },
                { desa: 'Sumberjo', Jumlah_Keluarga: 490, PUS: 199 },
                { desa: 'Sukorejo', Jumlah_Keluarga: 1276, PUS: 574 },
                { desa: 'Kalipang', Jumlah_Keluarga: 2736, PUS: 1126 },
                { desa: 'Kembangarum', Jumlah_Keluarga: 690, PUS: 284 },
                { desa: 'Jingglong', Jumlah_Keluarga: 1928, PUS: 844 },
                { desa: 'Kaulon', Jumlah_Keluarga: 777, PUS: 337 },
                { desa: 'Jegu', Jumlah_Keluarga: 1344, PUS: 554 }
              ],
            },
            {
              id: 'bab4-pie-chart3',
              type: 'pie',
              title: 'Persentase Jumlah Pasangan Usia Subur Dari Jenis Keikutan Peserta KB',
              description: 'Pemerintah: 2159, Swasta: 3049',
              data: [
                { name: 'Pemerintah', value: 2159},
                { name: 'Swasta', value: 3049}
              ],
            },
            {
              id: 'bab4-pie-chart4',
              type: 'pie',
              title: 'Jumlah Tempat Peribadatan Menurut Jenisnya',
              description: 'Masjid: 44, Mushola: 229, Gereja Protestan: 5, Gereja Katholik: 1',
              data: [
                { name: 'Gereja Protestan', value: 5},
                { name: 'Gereja Katholik', value: 1},
                { name: 'Masjid', value: 44},
                { name: 'Mushola', value: 229}
              ],
            },
            {
              id: 'bab4-bar-chart13',
              type: 'bar',
              title: 'Banyaknya Cerai Talak dan Cerai Gugat Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Cerai_Talak', 'Cerai_Gugat'],
              data: [
                { desa: 'Pandanarum', Cerai_Talak: 5, Cerai_Gugat: 17 },
                { desa: 'Kedungbunder', Cerai_Talak: 3, Cerai_Gugat: 4 },
                { desa: 'Sutojayan', Cerai_Talak: 2, Cerai_Gugat: 21 },
                { desa: 'Bacem', Cerai_Talak: 0, Cerai_Gugat: 9 },
                { desa: 'Sumberjo', Cerai_Talak: 0, Cerai_Gugat: 2 },
                { desa: 'Sukorejo', Cerai_Talak: 2, Cerai_Gugat: 8 },
                { desa: 'Kalipang', Cerai_Talak: 1, Cerai_Gugat: 9 },
                { desa: 'Kembangarum', Cerai_Talak: 1, Cerai_Gugat: 1 },
                { desa: 'Jingglong', Cerai_Talak: 3, Cerai_Gugat: 10 },
                { desa: 'Kaulon', Cerai_Talak: 0, Cerai_Gugat: 7 },
                { desa: 'Jegu', Cerai_Talak: 1, Cerai_Gugat: 6 }
              ],
            },
            {
              id: 'bab4-pie-chart4',
              type: 'bar',
              title: 'Banyaknya Pemeluk Agama Menurut Agama',
              xAxisKey: 'agama',
              keys: ['jumlah_Pemeluk'],
              data: [
                { agama: 'Islam', jumlah_Pemeluk: 58896},
                { agama: 'Katholik', jumlah_Pemeluk: 1516},
                { agama: 'Kristen Protestan', jumlah_Pemeluk: 401},
                { agama: 'Hindu', jumlah_Pemeluk: 0},
                { agama: 'Budha', jumlah_Pemeluk: 7}
              ],
            },
            {
              id: 'bab4-line',
              type: 'line',
              title: 'Jumlah Jamaah Haji Yang Diberangkatkan Ke Tanah Suci Di Kecamatan Sutojayan Tahun 2020-2024',
              xAxisKey: 'tahun',
              keys: ['jumlah'],       
              data: [
                { tahun: '2020', jumlah: 0},
                { tahun: '2021', jumlah: 0},
                { tahun: '2022', jumlah: 14},
                { tahun: '2023', jumlah: 51},
                { tahun: '2024', jumlah: 62},
              ],
            },
            {
              id: 'tren-kesehatan-line',
              type: 'line',
              title: 'Jumlah Pendonor Darah Menurut Golongan Darah',
              xAxisKey: 'tahun',
              keys: ['A', 'B', 'O', 'AB'],
              data: [
                { tahun: '2020', A: 19, B: 32, O: 42, AB: 10 },
                { tahun: '2021', A: 27, B: 36, O: 50, AB: 13 },
                { tahun: '2022', A: 28, B: 40, O: 57, AB: 13 },
                { tahun: '2023', A: 13, B: 36, O: 47, AB: 12 },
                { tahun: '2024', A: 12, B: 31, O: 39, AB: 11 },
              ],
            },
            {
              id: 'fasilitas-olahraga-stacked',
              type: 'bar',
              title: 'Kondisi Fasilitas Olahraga',
              description: 'Sebaran kondisi fasilitas olahraga di setiap desa.',
              xAxisKey: 'olahraga',
              keys: ['Baik', 'Rusak_Sedang', 'Rusak_Parah', 'Tidak_Ada'], 
              data: [
                { olahraga: 'Sepak Bola', Baik: 9, Rusak_Sedang: 1, Rusak_Parah: 1, Tidak_Ada: 1 },
                { olahraga: 'Bola Voli', Baik: 8, Rusak_Sedang: 0, Rusak_Parah: 1, Tidak_Ada: 3 },
                { olahraga: 'Bulu Tangkis', Baik: 9, Rusak_Sedang: 1, Rusak_Parah: 0, Tidak_Ada: 2 },
                { olahraga: 'Bola Basket', Baik: 1, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 11 },
                { olahraga: 'Tenis Lapangan', Baik: 0, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 12 },
                { olahraga: 'Tenis Meja', Baik: 8, Rusak_Sedang: 0, Rusak_Parah: 1, Tidak_Ada: 3 },
                { olahraga: 'Futsal', Baik: 2, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 10 },
                { olahraga: 'Renang', Baik: 3, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 9 },
                { olahraga: 'Bela Diri', Baik: 2, Rusak_Sedang: 0, Rusak_Parah: 0, Tidak_Ada: 10 },
              ],
            }       
          ],
        },
        'bab5': {
          title: 'BAB 5',
          description: 'Pertanian',
          charts: [
            {
              id: 'tanaman-hortikultura-line',
              type: 'line', 
              title: 'Luas Panen Tanaman Sayuran dan Buah-buahan Semusim Menurut Jenis Tanaman di Kecamatan Kanigoro (ha), 2021-2024 ',
              xAxisKey: 'tahun',
              keys: ['BawangMerah', 'CabaiRawit', 'CabaiBesar', 'Melon'], 
              data: [
                { tahun: '2021', BawangMerah: 42, CabaiRawit: 98, CabaiBesar: 0, Melon: 5, Kubis: 0 },
                { tahun: '2022', BawangMerah: 43, CabaiRawit: 177, CabaiBesar: 4, Melon: 2, Kubis: 0 },
                { tahun: '2023', BawangMerah: 11, CabaiRawit: 65, CabaiBesar: 0, Melon: 0, Kubis: 1 },
                { tahun: '2024', BawangMerah: 12, CabaiRawit: 36, CabaiBesar: 0, Melon: 0, Kubis: 0 },
              ],
            },
            {
              id: 'produksi-sayuran-buah-line',
              type: 'line',
              title: 'Tren Produksi Sayuran & Buah (Kuintal)',
              description: 'Fluktuasi hasil produksi Bawang Merah, Cabai Rawit, dan Buah-buahan (2021-2024).',
              xAxisKey: 'tahun',
              keys: ['BawangMerah', 'CabaiRawit', 'BuahBuahan'], 
              data: [
                {tahun: '2021', BawangMerah: 4230,CabaiRawit: 7618, BuahBuahan: 1300, CabaiBesar: 0, Kubis: 0 },
                {tahun: '2022', BawangMerah: 3081, CabaiRawit: 4005, BuahBuahan: 750, CabaiBesar: 79, Kubis: 0 },
                {tahun: '2023', BawangMerah: 1190, CabaiRawit: 6975, BuahBuahan: 0, CabaiBesar: 0, Kubis: 200 },
                {tahun: '2024', BawangMerah: 1101, CabaiRawit: 440, BuahBuahan: 0, CabaiBesar: 0, Kubis: 0 },
              ],
            },
            {
              id: 'produksi-buah-tahunan-area',
              type: 'area', 
              title: 'Dinamika Produksi Buah Tahunan (Kuintal)',
              description: 'Pergeseran dominasi jenis tanaman buah (2021-2024).',
              xAxisKey: 'tahun',
              keys: ['Durian', 'Mangga', 'Pisang', 'Salak', 'Pepaya', 'Nangka'], 
              data: [
                {tahun: '2021', Durian: 13898, Mangga: 9007, Pisang: 5425, Salak: 311, Pepaya: 204, Nangka: 0},
                {tahun: '2022', Durian: 7835, Mangga: 7764, Pisang: 1794, Salak: 188, Pepaya: 177, Nangka: 0 },
                {tahun: '2023', Durian: 1350, Mangga: 2810, Pisang: 14025, Salak: 642, Pepaya: 515, Nangka: 0},
                {tahun: '2024', Durian: 0, Mangga: 0, Pisang: 4000, Salak: 9735, Pepaya: 3700, Nangka: 11420},
              ],
            },
            {
              id: 'luas-lahan-sawah-stacked',
              type: 'bar',
              title: 'Luas Lahan Sawah Irigasi (Hektar)',
              description: 'Total luas lahan sawah berdasarkan intensitas pengairan (Satu kali vs Dua kali).',
              xAxisKey: 'desa',
              keys: ['irigasi_satu_kali', 'irigasi_dua_kali'], 
              data: [
                { desa: 'Minggirsari', irigasi_satu_kali: 32, irigasi_dua_kali: 25 },
                { desa: 'Gogodeso', irigasi_satu_kali: 74, irigasi_dua_kali: 58 },
                { desa: 'Karangsono', irigasi_satu_kali: 72, irigasi_dua_kali: 57 },
                { desa: 'Satreyan', irigasi_satu_kali: 129, irigasi_dua_kali: 103 },
                { desa: 'Kanigoro', irigasi_satu_kali: 67, irigasi_dua_kali: 52 },
                { desa: 'Tlogo', irigasi_satu_kali: 70, irigasi_dua_kali: 56 },
                { desa: 'Gaprang', irigasi_satu_kali: 44, irigasi_dua_kali: 35 },
                { desa: 'Jatinom', irigasi_satu_kali: 35, irigasi_dua_kali: 27 },
                { desa: 'Kuningan', irigasi_satu_kali: 27, irigasi_dua_kali: 21 },
                { desa: 'Papungan', irigasi_satu_kali: 91, irigasi_dua_kali: 55 },
                { desa: 'Banggle', irigasi_satu_kali: 167, irigasi_dua_kali: 79 },
                { desa: 'Sawentar', irigasi_satu_kali: 240, irigasi_dua_kali: 82 },
              ],
            },
            {
              id: 'luas-lahanbukansawah-stacked',
              type: 'bar',
              title: 'Luas Lahan Pertanian Bukan Sawah Per Desa',
              xAxisKey: 'desa',
              keys: ['kebun', 'hutan_Rakyat'], 
              data: [
                { desa: 'Minggirsari', kebun: 32, hutan_Rakyat: 25 },
                { desa: 'Gogodeso', kebun: 74, hutan_Rakyat: 58 },
                { desa: 'Karangsono', kebun: 72, hutan_Rakyat: 57 },
                { desa: 'Satreyan', kebun: 129, hutan_Rakyat: 103 },
                { desa: 'Kanigoro', kebun: 67, hutan_Rakyat: 52 },
                { desa: 'Tlogo', kebun: 70, hutan_Rakyat: 56 },
                { desa: 'Gaprang', kebun: 44, hutan_Rakyat: 35 },
                { desa: 'Jatinom', kebun: 35, hutan_Rakyat: 27 },
                { desa: 'Kuningan', kebun: 27, hutan_Rakyat: 21 },
                { desa: 'Papungan', kebun: 91, hutan_Rakyat: 55 },
                { desa: 'Banggle', kebun: 167, hutan_Rakyat: 79 },
                { desa: 'Sawentar', kebun: 240, hutan_Rakyat: 82 },
              ],
            },
            {
              id: 'perbandingan-lahan-desa',
              type: 'bar',
              title: 'Komposisi Penggunaan Lahan per Desa',
              description: 'Perbandingan luas lahan sawah vs lahan bukan sawah (Hektar).',
              xAxisKey: 'desa',
              keys: ['lahan_sawah', 'lahan_bukan_sawah'], 
              data: [
                { desa: 'Minggirsari', lahan_sawah: 57, lahan_bukan_sawah: 133 },
                { desa: 'Gogodeso', lahan_sawah: 133, lahan_bukan_sawah: 189 },
                { desa: 'Karangsono', lahan_sawah: 129, lahan_bukan_sawah: 249 },
                { desa: 'Satreyan', lahan_sawah: 233, lahan_bukan_sawah: 62 },
                { desa: 'Kanigoro', lahan_sawah: 119, lahan_bukan_sawah: 222 },
                { desa: 'Tlogo', lahan_sawah: 126, lahan_bukan_sawah: 199 },
                { desa: 'Gaprang', lahan_sawah: 79, lahan_bukan_sawah: 137 },
                { desa: 'Jatinom', lahan_sawah: 62, lahan_bukan_sawah: 164 },
                { desa: 'Kuningan', lahan_sawah: 49, lahan_bukan_sawah: 81 },
                { desa: 'Papungan', lahan_sawah: 146, lahan_bukan_sawah: 223 },
                { desa: 'Banggle', lahan_sawah: 246, lahan_bukan_sawah: 305 },
                { desa: 'Sawentar', lahan_sawah: 322, lahan_bukan_sawah: 566 },
              ],
            },
            {
              id: 'perkebunan-stacked-bar',
              type: 'bar',
              title: 'Luas Areal Perkebunan (Ribu Ha)',
              description: 'Penurunan luas lahan perkebunan didominasi oleh komoditas Kelapa.',
              xAxisKey: 'tahun',
              keys: ['Kelapa', 'Kakao', 'Tebu', 'Tembakau'], 
              data: [
                {tahun: '2023', Kelapa: 0.98, Kakao: 0.06, Tebu: 0.06, Tembakau: 0.02},
                {tahun: '2024', Kelapa: 0.58, Kakao: 0.06, Tebu: 0.06, Tembakau: 0.01 },
              ],
            },
            {
              id: 'tanam-panen-pangan',
              type: 'bar', 
              title: 'Perbandingan Luas Tanam vs Panen (Ha)',
              description: 'Realisasi luas panen dibandingkan dengan luas tanam bahan pangan utama.',
              xAxisKey: 'komoditas',
              keys: ['LuasTanam', 'LuasPanen'], 
              data: [
                {komoditas: 'Padi Sawah', LuasTanam: 1982, LuasPanen: 1324 },
                {komoditas: 'Jagung', LuasTanam: 3829, LuasPanen: 3318 },
                {komoditas: 'Ketela Rambat', LuasTanam: 45, LuasPanen: 72 },
                {komoditas: 'Kacang Tanah', LuasTanam: 30, LuasPanen: 33},
              ],
            },
            {
              id: 'kelas-kelompok-tani-stacked',
              type: 'bar',
              title: 'Klasifikasi Kemampuan Kelompok Tani',
              description: 'Perkembangan kelas kemampuan kelompok tani (Pemula hingga Utama).',
              xAxisKey: 'tahun',
              keys: ['Pemula', 'Lanjut', 'Madya', 'Utama'], 
              data: [
                {tahun: '2020', Pemula: 65, Lanjut: 19, Madya: 0, Utama: 0},
                {tahun: '2021', Pemula: 30, Lanjut: 20, Madya: 0, Utama: 1},
                {tahun: '2022', Pemula: 63, Lanjut: 19, Madya: 0, Utama: 0},
                {tahun: '2023', Pemula: 64, Lanjut: 114, Madya: 11, Utama: 1},
                {tahun: '2024', Pemula: 10, Lanjut: 49, Madya: 0, Utama: 0 },
              ],
            },
            {
              id: 'tren-pemilik-ikan-area',
              type: 'area',
              title: 'Tren Jumlah Pembudidaya Ikan',
              description: 'Pertumbuhan jumlah pemilik kolam ikan tawar (Luas lahan konstan 18 Ha).',
              xAxisKey: 'tahun',
              keys: ['JumlahPemilik'], 
              data: [
                { tahun: '2020', JumlahPemilik: 275 },
                { tahun: '2021', JumlahPemilik: 276 },
                { tahun: '2022', JumlahPemilik: 282 },
                { tahun: '2023', JumlahPemilik: 282 },
                { tahun: '2024', JumlahPemilik: 290 },
              ],
            },
            {
              id: 'bab5-pie-chart1',
              type: 'pie',
              title: 'Populasi Ternak Menurut Desa Di  Kecamatan Kanigoro',
              description: 'Sapi Potong: 7597, Kambing: 19327, Domba: 1079, Sapi Perah: 398',
              data: [
                { name: 'Sapi Potong', value: 7597},
                { name: 'Kambing', value: 19327},
                { name: 'Domba', value: 1079},
                { name: 'Sapi Perah', value: 398}
              ],
            },
            {
              id: 'bab5-pie-chart2',
              type: 'pie',
              title: 'Produksi Telor Menurut Jenis Unggas (Ton)',
              description: 'Ayam Buras: 32.88, Ayam Ras: 1530.74, Itik: 253.94, Entok: 3.09',
              data: [
                { name: 'Ayam Buras', value: 32.88},
                { name: 'Ayam Ras', value: 1530.74},
                { name: 'Itik', value: 253.94},
                { name: 'Entok', value: 3.09}
              ],
            },
          ],
        },
        'bab6': {
          title: 'BAB 6',
          description: 'Pariwisata Transportasi Komunikasi',
          charts: [
            {
              id: 'bts-operator-grouped',
              type: 'bar',
              title: 'Infrastruktur Telekomunikasi Desa',
              description: 'Perbandingan jumlah menara BTS fisik dengan jumlah operator yang aktif.',
              xAxisKey: 'desa',
              keys: ['MenaraBTS', 'Operator'], 
              data: [
                { desa: 'Minggirsari', MenaraBTS: 1, Operator: 2 },
                { desa: 'Gogodeso', MenaraBTS: 1, Operator: 3 },
                { desa: 'Karangsono', MenaraBTS: 1, Operator: 0 }, 
                { desa: 'Satreyan', MenaraBTS: 2, Operator: 1 },
                { desa: 'Kanigoro', MenaraBTS: 3, Operator: 3 },
                { desa: 'Tlogo', MenaraBTS: 1, Operator: 3 },
                { desa: 'Gaprang', MenaraBTS: 2, Operator: 3 },
                { desa: 'Jatinom', MenaraBTS: 1, Operator: 1 },
                { desa: 'Kuningan', MenaraBTS: 3, Operator: 3 },
                { desa: 'Papungan', MenaraBTS: 1, Operator: 1 },
                { desa: 'Banggle', MenaraBTS: 2, Operator: 4 },
                { desa: 'Sawentar', MenaraBTS: 6, Operator: 6 },
              ],
            },
            {
              id: 'distribusi-sinyal-pie',
              type: 'pie',
              title: 'Kualitas Sinyal Seluler & Internet',
              description: 'Persentase desa berdasarkan kekuatan sinyal dan jenis jaringan internet.',
              data: [
                { name: 'Sinyal Sangat Kuat', value: 9}, 
                { name: 'Sinyal Kuat', value: 3},       
              ],
            },
            {
              id: 'objek-wisata-bar',
              type: 'bar',
              title: 'Jumlah Objek Wisata Menurut Desa',
              xAxisKey: 'desa',
              keys: ['Objek_Wisata'], 
              data: [
                { desa: 'Minggirsari', Objek_Wisata: 1},
                { desa: 'Gogodeso', Objek_Wisata: 1},
                { desa: 'Karangsono', Objek_Wisata: 1}, 
                { desa: 'Satreyan', Objek_Wisata: 0},
                { desa: 'Kanigoro', Objek_Wisata: 2},
                { desa: 'Tlogo', Objek_Wisata: 1},
                { desa: 'Gaprang', Objek_Wisata: 1},
                { desa: 'Jatinom', Objek_Wisata: 0},
                { desa: 'Kuningan', Objek_Wisata: 1},
                { desa: 'Papungan', Objek_Wisata: 0},
                { desa: 'Banggle', Objek_Wisata: 0},
                { desa: 'Sawentar', Objek_Wisata: 3},
              ],
            },
            {
              id: 'pie-prasarana',
              type: 'pie',
              title: 'Jenis Prasarana Transportasi',
              description: '100% wilayah menggunakan akses darat.',
              data: [
                { name: 'Darat', value: 12}, 
                { name: 'Air/Laut', value: 0}, 
              ],
            },
          ],
        },
        'bab7': {
          title: 'BAB 7',
          description: 'Perbankan Koperasi Perdagangan',
          charts: [
            {
              id: 'pie-koperasi',
              type: 'pie',
              title: 'Banyaknya Koperasi yang Masih Aktif',
              description: 'Koperasi Unit Desa (KUD): 2, Koperasi Simpan Pinjam (Kospin): 13',
              data: [
                { name: 'KUD', value: 2}, 
                { name: 'Kospin', value: 13}, 
              ],
            },
            {
              id: 'pie-lembaga-keuangan',
              type: 'pie',
              title: 'Banyaknya Sarana Lembaga Keuangan Bank',
              description: 'Bank Umum: 4, Bank Perkreditan Rakyat (BPR): 7',
              data: [
                { name: 'Bank Umum', value: 4}, 
                { name: 'Bank Perkredita', value: 7}, 
              ],
            },
            {
              id: 'pie-wajib-pajak',
              type: 'pie',
              title: 'Wajib Pajak Terdaftar di Kecamatan Kanigoro sd Desember 2024',
              description: 'Orang Pribadi: 3771, Badan: 551, Bendahara: 52',
              data: [
                { name: 'Orang Pribadi', value: 3771}, 
                { name: 'Badan', value: 551}, 
                { name: 'Bendahara', value: 52}
              ],
            },
            {
              id: 'bab7-bar-chart1',
              type: 'bar',
              title: 'Banyaknya Sarana Perdagangan Menurut Desa dan Jenis Sarana Perdagangan',
              xAxisKey: 'desa',
              keys: ['Kelompok_Pertokoan', 'Pasar', 'Supermarket'],
              data: [
                { desa: 'Minggirsari', Kelompok_Pertokoan: 0, Pasar: 0, Supermarket: 0},
                { desa: 'Gogodeso', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 3},
                { desa: 'Karangsono', Kelompok_Pertokoan: 1, Pasar: 0, Supermarket: 1},
                { desa: 'Satreyan', Kelompok_Pertokoan: 2, Pasar: 1, Supermarket: 1},
                { desa: 'Kanigoro', Kelompok_Pertokoan: 9, Pasar: 0, Supermarket: 9},
                { desa: 'Tlogo', Kelompok_Pertokoan: 4, Pasar: 0, Supermarket: 4},
                { desa: 'Gaprang', Kelompok_Pertokoan: 5, Pasar: 0, Supermarket: 5},
                { desa: 'Jatinom', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2},
                { desa: 'Kuningan', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2},
                { desa: 'Papungan', Kelompok_Pertokoan: 2, Pasar: 0, Supermarket: 1},
                { desa: 'Banggle', Kelompok_Pertokoan: 2, Pasar: 0, Supermarket: 2},
                { desa: 'Sawentar', Kelompok_Pertokoan: 3, Pasar: 0, Supermarket: 2}
              ],
            },
          ],
        },        
      },
    }
  };
  

const currentCategoryData = contentData[selectedCategory];
  const finalContentData = currentCategoryData?.subCategories?.[selectedSubCategory];

  const getGradientStyle = () => {
    return { background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))' };
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-main-content">

        <div className="mobile-header-controls">
            <button 
                className="mobile-filter-btn"
                onClick={() => setShowMobileFilter(true)}
            >
                <Filter size={20} />
                <span>Filter Data</span>
            </button>
        </div>
        
        <div className="dashboard-layout">

          {showMobileFilter && (
            <div 
                className="filter-backdrop" 
                onClick={() => setShowMobileFilter(false)} 
            />
          )}

          <aside className={`filter-section-card ${showMobileFilter ? 'mobile-open' : ''}`}>
            <div className="filter-header-content">
              <div className="flex items-center gap-2">
                <Filter className="filter-header-icon" />
                <h3 className="filter-header-title">Filter</h3>
              </div>
              <button 
                className="mobile-close-btn" 
                onClick={() => setShowMobileFilter(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="filter-grid-container">
              <div className="filter-group">
                <label>Kecamatan</label>
                <div className="filter-select-wrapper">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">-- Pilih Wilayah --</option>
                    {Object.keys(contentData).map((key) => (
                      <option key={key} value={key}>
                        {contentData[key].title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            
              <div className="filter-group">
                <label>Bab Statistik</label>
                <div className="filter-select-wrapper">
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    disabled={!selectedCategory}
                    className={`filter-select ${!selectedCategory ? 'dropdown-disabled' : ''}`}
                  >
                    <option value="">
                      {selectedCategory ? '-- Pilih BAB --' : 'Pilih wilayah dahulu'}
                    </option>
                    {selectedCategory && currentCategoryData?.subCategories &&
                      Object.keys(currentCategoryData.subCategories).map((subKey) => (
                        <option key={subKey} value={subKey}>
                          {currentCategoryData.subCategories[subKey].title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <main className="main-content-area">
            
            <div className="dashboard-header" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <h1>Dashboard Dalam Data</h1>
              <p>Dashboard yang mengambil data dari Kecamatan Dalam Angka 2025</p>
            </div>

            {(!selectedCategory || !selectedSubCategory) && (
              <div className="placeholder-card">
                <div className="placeholder-content">
                  <Grid3x3 className="icon-large" />
                  <p className="mb-2">Silakan lengkapi filter di sebelah kiri</p>
                  <p>untuk memuat visualisasi data.</p>
                </div>
              </div>
            )}

            {finalContentData && (
              <div className="stats-cards-grid">
                <div className="stat-card blue" style={getGradientStyle()}>
                  <div className="info-card-inner">
                    <div className="icon-wrapper">
                      {currentCategoryData.icon || <Book />}
                    </div>
                    <div className="info-text-wrapper">
                      <p className="label">{finalContentData.title} </p>
                      <p className="desc">{finalContentData.description}</p>
                    </div>
                  </div>
                </div>

                {finalContentData.charts && finalContentData.charts.map((chartItem) => (
                  <div key={chartItem.id} className="chart-card">
                    <h3 className="chart-title">{chartItem.title}</h3>
                    {chartItem.description && (
                        <p className="chart-description">{chartItem.description}</p>
                    )}
                    <ChartRenderer chartItem={chartItem} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div> 
      </div>
    </div>
  );
};

export default App;