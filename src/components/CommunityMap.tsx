/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VillageCommunity, Incident, IncidentCategory } from '../types';
import { 
  Droplet, 
  Flame, 
  MapPin, 
  Compass, 
  Wrench, 
  Activity, 
  Grid, 
  Users, 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle,
  Truck,
  Eye,
  PlusCircle
} from 'lucide-react';

interface CommunityMapProps {
  village: VillageCommunity;
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  onSelectMapCoordinates?: (x: number, y: number) => void;
  isPinpointingMode?: boolean;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  village,
  incidents,
  selectedIncident,
  onSelectIncident,
  onSelectMapCoordinates,
  isPinpointingMode = false,
}) => {
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);

  // Categories helper to map icon
  const getCategoryIcon = (category: IncidentCategory) => {
    switch (category) {
      case 'Water': return <Droplet className="w-4 h-4 text-sky-600" />;
      case 'Power': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Roads': return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'Medical': return <Activity className="w-4 h-4 text-rose-600" />;
      case 'Waste': return <Wrench className="w-4 h-4 text-purple-600" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500 text-white ring-rose-400';
      case 'High': return 'bg-amber-500 text-white ring-amber-300';
      case 'Medium': return 'bg-indigo-500 text-white ring-indigo-200';
      default: return 'bg-slate-500 text-white ring-slate-200';
    }
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Keep within logical safety margins [10, 90]
    const boundedX = Math.max(10, Math.min(90, x));
    const boundedY = Math.max(10, Math.min(90, y));

    if (isPinpointingMode && onSelectMapCoordinates) {
      setClickCoord({ x: boundedX, y: boundedY });
      onSelectMapCoordinates(boundedX, boundedY);
    }
  };

  const filteredIncidents = incidents.filter(inc => inc.villageId === village.id);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm transition-all relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
            Interactive Village Layout Dashboard
          </span>
          <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            Topology Map: <span className="text-emerald-700 font-semibold">{village.name}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {village.region} • Coords: {Math.round(village.latitude)}°N, {Math.round(village.longitude)}°W
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {isPinpointingMode ? (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 font-medium rounded-full border border-amber-200/60 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Click Map to Place Pinpoint
            </span>
          ) : (
            <div className="flex items-center gap-3 text-[11px] font-medium text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Medium/Low</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative border border-stone-100 bg-stone-50/55 rounded-xl aspect-[1.5/1] overflow-hidden select-none">
        
        {/* SVG Rural Village Landscape Base */}
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full transition-all duration-300 ${isPinpointingMode ? 'cursor-crosshair hover:bg-emerald-50/15' : 'cursor-default'}`} 
          onClick={handleMapClick}
        >
          {/* Defined grids patterns */}
          <defs>
            <pattern id="villageGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e7e5e4" strokeWidth="0.25" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#villageGrid)" />

          {/* Woodland Borders representation (Green zones) */}
          <path d="M 0,20 Q 25,10 40,30 T 70,5 T 100,20 L 100,0 L 0,0 Z" fill="#2e5a44" fillOpacity="0.08" />
          <path d="M 0,80 Q 30,95 60,78 T 100,85 L 100,100 L 0,100 Z" fill="#2e5a44" fillOpacity="0.06" />

          {/* River Stream */}
          <path 
            d="M -10,48 Q 20,40 50,55 T 110,42" 
            fill="none" 
            stroke="#bae6fd" 
            strokeWidth="3.8" 
            strokeLinecap="round" 
            strokeOpacity="0.8"
          />
          <path 
            d="M -10,48 Q 20,40 50,55 T 110,42" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="0.8" 
            strokeLinecap="round" 
            strokeOpacity="0.3"
          />

          {/* Village Main Dirt Roads */}
          <path 
            d="M 25,-10 L 25,110" 
            fill="none" 
            stroke="#e7e5e4" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray="2, 1"
          />
          <path 
            d="M -10,75 L 110,75" 
            fill="none" 
            stroke="#e7e5e4" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray="2, 1"
          />
          <path 
            d="M 25,75 L 85,25" 
            fill="none" 
            stroke="#e7e5e4" 
            strokeWidth="2" 
            strokeOpacity="0.7"
          />

          {/* Village Landmarks based on coordinates (Static illustrative references) */}
          {/* Medical Clinic / Health Center */}
          <g transform="translate(15, 25)">
            <ellipse cx="0" cy="0" rx="4" ry="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.4" />
            <rect x="-3" y="-5" width="6" height="5" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M -1,-2.5 L 1,-2.5 M 0,-3.5 L 0,-1.5" stroke="#ef4444" strokeWidth="0.5" />
            <text x="0" y="4" fontSize="2.5" textAnchor="middle" fontWeight="bold" fill="#64748b">Clinic</text>
          </g>

          {/* Central Water Pump House */}
          <g transform="translate(48, 48)">
            <ellipse cx="0" cy="0" rx="3.5" ry="1.8" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.4" />
            <rect x="-2.5" y="-4" width="5" height="4" rx="0.5" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="0.4" />
            <circle cx="0" cy="-2" r="1.2" fill="#38bdf8" />
            <text x="0" y="4.5" fontSize="2.5" textAnchor="middle" fontWeight="bold" fill="#0284c7">Water Station</text>
          </g>

          {/* Village School or Community Hall */}
          <g transform="translate(80, 80)">
            <ellipse cx="0" cy="0" rx="5" ry="2.5" fill="#fef3c7" stroke="#fde68a" strokeWidth="0.4" />
            <polygon points="-4,-1 -4,-5 0,-8 4,-5 4,-1" fill="#fff" stroke="#d97706" strokeWidth="0.4" />
            <text x="0" y="5" fontSize="2.5" textAnchor="middle" fontWeight="bold" fill="#b45309">Village Hall</text>
          </g>

          {/* Solar Array Power Station */}
          <g transform="translate(25, 87)">
            <rect x="-4" y="-3.5" width="8" height="5" rx="1" fill="#1e293b" />
            <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#38bdf8" strokeWidth="0.4" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#38bdf8" strokeWidth="0.4" />
            <line x1="-2" y1="-3" x2="-2" y2="1" stroke="#38bdf8" strokeWidth="0.2" />
            <line x1="0" y1="-3" x2="0" y2="1" stroke="#38bdf8" strokeWidth="0.2" />
            <line x1="2" y1="-3" x2="2" y2="1" stroke="#38bdf8" strokeWidth="0.2" />
            <text x="0" y="4" fontSize="2.5" textAnchor="middle" fontWeight="bold" fill="#475569">Solar Hub</text>
          </g>

          {/* Temporary Marker for click pinpoint placement */}
          {clickCoord && isPinpointingMode && (
            <g transform={`translate(${clickCoord.x}, ${clickCoord.y})`} className="animate-pulse">
              <circle cx="0" cy="0" r="4.5" fill="#f59e0b" fillOpacity="0.25" />
              <circle cx="0" cy="0" r="1.5" fill="#d97706" />
              <path d="M 0 0 L -2 -4 L 2 -4 Z" fill="#d97706" />
            </g>
          )}

          {/* Active Incident Pins */}
          {filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const isResolved = incident.status === 'Resolved';
            const size = isSelected ? 3.8 : 2.8;

            return (
              <g 
                key={incident.id} 
                transform={`translate(${incident.mapX}, ${incident.mapY})`}
                className="cursor-pointer group select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPinpointingMode) onSelectIncident(incident);
                }}
              >
                {/* Outer pulsing ring for critical/high issues */}
                {(incident.severity === 'Critical' || incident.severity === 'High') && !isResolved && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r={size * 2} 
                    fill={incident.severity === 'Critical' ? '#ef4444' : '#f59e0b'} 
                    fillOpacity="0.18"
                    className="animate-ring-pulse transform origin-center"
                  />
                )}

                {/* Pin base background */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r={size} 
                  fill={isResolved ? '#10b981' : (incident.severity === 'Critical' ? '#ef4444' : incident.severity === 'High' ? '#f59e0b' : '#3b82f6')} 
                  stroke="#ffffff" 
                  strokeWidth="0.5" 
                  className={`transition-all duration-200 shadow-md ${isSelected ? 'scale-125 stroke-stone-900 stroke-1' : 'group-hover:scale-115'}`}
                />

                {/* Incident type mini details overlay */}
                <g transform={`translate(0, -${size + 1.5})`}>
                  <rect 
                    x="-10" 
                    y="-4" 
                    width="20" 
                    height="3.5" 
                    rx="0.5" 
                    fill="#1f2937" 
                    opacity="0"
                    className="group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  />
                  <text 
                    x="0" 
                    y="-1.5" 
                    fontSize="1.8" 
                    fill="#ffffff" 
                    textAnchor="middle" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono font-medium pointer-events-none"
                  >
                    {incident.category} &bull; {incident.severity}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Resource Deployment Info */}
        <div className="absolute top-2.5 left-2.5 max-w-[200px] bg-stone-900/90 backdrop-blur-sm rounded-lg p-2 text-[10px] text-stone-300 border border-stone-800 pointer-events-none">
          <p className="font-mono font-semibold text-emerald-400 border-b border-stone-800 pb-1 mb-1">
            DEPLOYED RESPONSE UNITS
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Truck className="w-2.5 h-2.5 text-stone-400" /> Utility Crews:</span>
              <span className="font-mono text-white text-[9px]">
                {filteredIncidents.filter(i => i.status !== 'Resolved' && i.resourceAllocated?.includes('crew')).length} Assigned / {village.resources.crew} Total
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Truck className="w-2.5 h-2.5 text-stone-400" /> General Trucks:</span>
              <span className="font-mono text-white text-[9px]">
                {filteredIncidents.filter(i => i.status !== 'Resolved' && i.resourceAllocated?.includes('trucks')).length} Active / {village.resources.trucks} Pool
              </span>
            </div>
          </div>
        </div>

        {/* Floating Compass Indicator */}
        <div className="absolute right-2.5 bottom-2.5 text-[9px] font-mono text-stone-400 flex items-center gap-1 bg-white/70 px-1.5 py-0.5 rounded-md border border-stone-200/50">
          <Eye className="w-2.5 h-2.5 text-stone-500" /> Right click or click to select coordinate
        </div>
      </div>

      {/* Selected marker quick preview panel */}
      {selectedIncident && selectedIncident.villageId === village.id && (
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/70 flex flex-col md:flex-row items-stretch gap-3 animate-fade-in text-xs">
          {selectedIncident.imageUrl && (
            <div className="w-full md:w-24 h-20 rounded-lg overflow-hidden shrink-0 border border-emerald-200 bg-stone-100 shadow-sm relative">
              <img
                src={selectedIncident.imageUrl}
                alt="Uploaded issue context"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 px-1 bg-stone-900/75 text-white font-mono text-[8px] rounded">Resident Pic</span>
            </div>
          )}
          <div className="flex-1 min-w-0 flex items-start gap-2.5">
            <div className={`p-2 rounded-lg shrink-0 ${getSeverityStyle(selectedIncident.severity)}`}>
              {getCategoryIcon(selectedIncident.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-bold text-stone-900 truncate">
                  {selectedIncident.title}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                  selectedIncident.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  selectedIncident.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                  selectedIncident.status === 'Investigating' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                }`}>
                  {selectedIncident.status}
                </span>
              </div>
              <p className="text-stone-600 line-clamp-1 mb-1.5">{selectedIncident.description}</p>
              <div className="flex flex-wrap text-[10px] text-stone-500 items-center gap-x-3 gap-y-1 font-mono">
                <span>
                  Reported: <strong className="text-stone-700 font-sans">
                    {selectedIncident.isAnonymous ? '👤 Anonymous Resident' : selectedIncident.reporterName}
                  </strong>
                </span>
                <span>•</span>
                <span>Map Pin: <strong className="text-stone-700">{selectedIncident.mapX}%X, {selectedIncident.mapY}%Y</strong></span>
                {selectedIncident.isAnonymous && (
                  <span className="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded text-[8px] font-semibold">Anonymous Post</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
