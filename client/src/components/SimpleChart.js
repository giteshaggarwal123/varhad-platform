import React from 'react';

const SimpleChart = ({ data, title, type = 'bar' }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
        {title}
      </h3>
      
      {type === 'bar' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>
                {item.value}
              </div>
              <div 
                style={{ 
                  width: '100%', 
                  background: `linear-gradient(135deg, ${item.color || '#667eea'} 0%, ${item.color || '#764ba2'} 100%)`,
                  borderRadius: '4px 4px 0 0',
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '20px',
                  transition: 'all 0.3s ease'
                }}
              />
              <div style={{ fontSize: '12px', color: '#718096', textAlign: 'center', wordBreak: 'break-word' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {type === 'line' && (
        <div style={{ position: 'relative', height: '200px', padding: '10px 0' }}>
          <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
            {data.map((item, index) => {
              if (index === 0) return null;
              const prevItem = data[index - 1];
              const x1 = ((index - 1) / (data.length - 1)) * 100;
              const x2 = (index / (data.length - 1)) * 100;
              const y1 = 100 - ((prevItem.value / maxValue) * 80);
              const y2 = 100 - ((item.value / maxValue) * 80);
              
              return (
                <g key={index}>
                  <line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#667eea"
                    strokeWidth="3"
                  />
                  <circle cx={`${x2}%`} cy={`${y2}%`} r="5" fill="#667eea" />
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {data.map((item, index) => (
              <div key={index} style={{ fontSize: '11px', color: '#718096', textAlign: 'center' }}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
