interface CPU {
  chipName: string;
  physicalCoreCount: number;
  globalUsage: number;
  cores: Array<Core>;
}

interface Core {
  usage: number;
  frequency: number;
}

interface Battery {
  temperature: number;
  cycleCount: number;
  state: number;
  percentage: number;
  stateOfHealth: number;
  timeToFull: string;
  timeToEmpty: string;
}

interface Memory {
  totalMemory: number;
  totalSwap: number;
  usedMemory: number;
  usedSwap: number;
}

interface Disk {
  name: string;
  availableSpace: number;
  totalSpace: number;
}

interface Process {
  name: string;
  memory: number;
  pid: string;
}

interface System {
  disks: Array<Disk>;
  sensors: Record<string, number>;
  loadAvg: number;
}
