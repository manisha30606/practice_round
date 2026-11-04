"use client";
import { CircleMarker, MapContainer, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Report = { _id: string; title: string; reference: string; address: string; location: { coordinates: [number, number] }; status: string };
function MapClick({ onPick }: { onPick?: (point: { lat: number; lng: number }) => void }) {
  useMapEvents({ click(event) { onPick?.({ lat: event.latlng.lat, lng: event.latlng.lng }); } });
  return null;
}
export function CivicMap({ reports = [], onPick, center = [22.5726, 88.3639] }: { reports?: Report[]; onPick?: (point: { lat: number; lng: number }) => void; center?: [number, number] }) {
  return <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200">
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <MapClick onPick={onPick}/>
      {reports.map(report => <CircleMarker key={report._id} center={[report.location.coordinates[1], report.location.coordinates[0]]} radius={8} pathOptions={{ color: "#2563EB", fillColor: "#0F9D91", fillOpacity: 0.9 }}>
        <Popup><strong>{report.title}</strong><br/>{report.reference}<br/>{report.address}<br/>{report.status.replaceAll("_"," ")}</Popup>
      </CircleMarker>)}
    </MapContainer>
  </div>;
}
