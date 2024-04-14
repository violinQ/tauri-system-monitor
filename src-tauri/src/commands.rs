use std::collections::HashMap;
use std::sync::Mutex;

use battery::Manager;
use lazy_static::lazy_static;
use sysinfo::{Components, Disks, System};

use super::structs::{
    BatteryMetrics,
    CoreMetric,
    CPUMetrics,
    DiskMetrics,
    MemoryMetrics,
    ProcessMetric,
    SystemMetrics,
};

lazy_static! {
    // 全局 system 实例
    static ref SYS: Mutex<System> = Mutex::new(System::new_all());
}

/**
 * 获取CPU监控数据
 */
#[tauri::command(async)]
pub fn get_cpu_metrics() -> CPUMetrics {
    match SYS.lock() {
        Ok(mut sys) => {
            sys.refresh_cpu();
            let mut cores = vec![];
            for core in sys.cpus() {
                cores.push(CoreMetric::new(core.cpu_usage(), core.frequency()));
            }
            CPUMetrics::new(&sys, cores)
        }
        Err(_) => CPUMetrics::default(),
    }
}

/**
 * 获取电池信息
 */
#[tauri::command(async)]
pub fn get_battery_metrics() -> BatteryMetrics {
    let manager = Manager::new().unwrap();
    let mut batteries = vec![];
    for (_, maybe_battery) in manager.batteries().unwrap().enumerate() {
        let mut battery = maybe_battery.unwrap();
        batteries.push(BatteryMetrics::new(&mut battery));
        break;
    }
    batteries.pop().unwrap_or(BatteryMetrics::default())
}

/**
 * 获取内存监控数据
 */
#[tauri::command(async)]
pub fn get_memory_metrics() -> MemoryMetrics {
    match SYS.lock() {
        Ok(mut sys) => {
            sys.refresh_memory();
            MemoryMetrics::new(&sys)
        }
        Err(_) => MemoryMetrics::default(),
    }
}

/**
 * 获取系统进程信息
 */
#[tauri::command(async)]
pub fn get_process_metrics() -> Vec<ProcessMetric> {
    match SYS.lock() {
        Ok(mut sys) => {
            sys.refresh_processes();
            let mut processes = vec![];
            for (_, process) in sys.processes() {
                processes.push(ProcessMetric::new(process));
            }
            processes.sort_by(|a, b| b.get_memory().partial_cmp(&a.get_memory()).unwrap());
            processes
        }
        Err(_) => vec![],
    }
}

/**
 * 获取系统监控数据
 */
#[tauri::command(async)]
pub fn get_system_metrics() -> SystemMetrics {
    // 获取传感器数据
    let mut sensors = HashMap::new();
    let components = Components::new_with_refreshed_list();
    for component in &components {
        sensors.insert(component.label().to_string(), component.temperature());
    }
    // 获取磁盘数据
    let mut disk_vec = vec![];
    let disks = Disks::new_with_refreshed_list();
    disks.list().iter().for_each(|disk| {
        disk_vec.push(DiskMetrics::new(disk));
    });
    // 获取系统负载数据
    let load_avg = System::load_average();
    SystemMetrics::new(disk_vec, sensors, load_avg.one)
}

/**
 * 更新托盘标题
 */
#[cfg(target_os = "macos")]
#[tauri::command(async)]
pub fn update_tray_title(app: tauri::AppHandle) -> Result<(), &'static str> {
    match SYS.lock() {
        Ok(mut sys) => {
            sys.refresh_memory();
            app.tray_handle()
                .set_title(
                    format!(
                        "| CPU: {:.0}% | 内存: {:.2}GB",
                        sys.global_cpu_info().cpu_usage(),
                        MemoryMetrics::bytes_to_gb(sys.used_memory())
                    ).as_str(),
                ).expect("");
            Ok(())
        }
        Err(_) => Err("更新托盘标题失败"),
    }
}