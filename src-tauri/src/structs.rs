use std::collections::HashMap;

use battery::{Battery, State};
use serde::Serialize;
use sysinfo::{Disk, Process, System};

/**
 * CPU 监控信息
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CPUMetrics {
    // 芯片名称
    chip_name: String,
    // 物理核心数
    physical_core_count: usize,
    // 总使用率
    global_usage: f32,
    // 各核心数据
    cores: Vec<CoreMetric>,
}

impl CPUMetrics {
    pub fn new(sysinfo: &System, cores: Vec<CoreMetric>) -> Self {
        let physical_core_count = sysinfo.physical_core_count().unwrap_or_else(|| 0);

        Self {
            chip_name: sysinfo.cpus()[0].brand().to_string(),
            global_usage: sysinfo.global_cpu_info().cpu_usage(),
            physical_core_count,
            cores,
        }
    }
}

/**
 * 内存监控信息
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MemoryMetrics {
    // 总内存
    total_memory: u64,
    // 总交换空间
    total_swap: u64,
    // 已使用内存
    used_memory: u64,
    // 已使用交换空间
    used_swap: u64,
}

impl MemoryMetrics {
    pub fn new(sysinfo: &System) -> Self {
        Self {
            total_memory: sysinfo.total_memory(),
            total_swap: sysinfo.total_swap(),
            used_memory: sysinfo.used_memory(),
            used_swap: sysinfo.used_swap(),
        }
    }

    pub fn bytes_to_gb(bytes: u64) -> f64 {
        bytes as f64 / 1024.0 / 1024.0 / 1024.0
    }
}

/**
 * 进程信息
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ProcessMetric {
    // 进程名称
    name: String,
    // 进程所使用内存
    memory: u64,
    // 进程 pid
    pid: String,
}

impl ProcessMetric {
    pub fn new(process: &Process) -> Self {
        Self {
            name: process.name().to_string(),
            pid: process.pid().to_string(),
            memory: process.memory(),
        }
    }

    /**
     * 获取进程占用内存
     */
    pub fn get_memory(&self) -> u64 {
        self.memory
    }
}

/**
 * 磁盘监控信息
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DiskMetrics {
    // 磁盘名称
    name: String,
    // 可用空间
    available_space: u64,
    // 总空间
    total_space: u64,
}

impl DiskMetrics {
    pub fn new(disk: &Disk) -> Self {
        let name = match disk.name().to_str() {
            Some(name_str) => String::from(name_str),
            None => String::from("Unknown Disk Name"),
        };

        Self {
            name,
            available_space: disk.available_space(),
            total_space: disk.total_space(),
        }
    }
}

/**
 * CPU 各核心监控信息
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CoreMetric {
    // cpu 使用率
    usage: f32,
    // 运行频率
    frequency: u64,
}

impl CoreMetric {
    pub fn new(usage: f32, frequency: u64) -> Self {
        Self { usage, frequency }
    }
}

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BatteryMetrics {
    // 电池温度
    temperature: f32,
    // 循环周期
    cycle_count: u32,
    // 充电状态
    state: i32,
    // 电量百分比
    percentage: f32,
    // 电池健康
    state_of_health: f32,
    // 还需多久充满
    time_to_full: String,
    // 电池剩余使用时间
    time_to_empty: String,
}

impl BatteryMetrics {
    pub fn new(battery: &mut Battery) -> Self {
        battery.refresh().unwrap();
        Self {
            temperature: match battery.temperature() {
                Some(r) => { r.value as f32 - 273.15 }
                None => 0.
            },
            cycle_count: battery.cycle_count().unwrap_or(0),
            state: match battery.state() {
                State::Full => 1,
                State::Charging => 2,
                State::Discharging => 3,
                State::Empty => 0,
                _ => -1,
            },
            percentage: battery.state_of_charge().value * 100.,
            state_of_health: battery.state_of_health().value * 100.,
            time_to_full: format!("{:?}", battery.time_to_full().unwrap_or_default()),
            time_to_empty: format!("{:?}", battery.time_to_empty().unwrap_or_default()),
        }
    }
}

/**
 * 系统监控数据
 */
#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemMetrics {
    disks: Vec<DiskMetrics>,
    sensors: HashMap<String, f32>,
    load_avg: f64,
}

impl SystemMetrics {
    pub fn new(disks: Vec<DiskMetrics>, sensors: HashMap<String, f32>, load_avg: f64) -> Self {
        Self {
            disks,
            sensors,
            load_avg,
        }
    }
}