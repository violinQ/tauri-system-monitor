import CPUPanel from './components/CPUPanel';
import BatteryPanel from './components/BatteryPanel';
import MemoryPanel from './components/MemoryPanel';
import ProcessPanel from './components/ProcessPanel';
import GaugePanel from './components/GaugePanel';

export default function MainPage() {
  return (
    <div class="space-y-2">
      <CPUPanel />
      <div class="flex space-x-2">
        <div class="flex flex-col w-1/2 space-y-2">
          <BatteryPanel />
          <MemoryPanel />
        </div>
        <div class="flex w-1/2 space-x-2">
          <GaugePanel />
        </div>
      </div>
      <ProcessPanel />
    </div>
  );
}
