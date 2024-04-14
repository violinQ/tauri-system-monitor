#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{AppHandle, Manager, SystemTrayEvent};

use commands::{
    get_battery_metrics,
    get_cpu_metrics,
    get_memory_metrics,
    get_process_metrics,
    get_system_metrics,
    update_tray_title,
};
use native::{create_tray, native_windows};

pub mod native;
mod structs;
mod commands;

fn main() {
    let system_tray = create_tray();
    tauri::Builder::default()
        .setup(|app| {
            // 根据label获取窗口实例
            let window = app.get_window("main").unwrap();
            native_windows(&window, Some(10.), false);
            // window.open_devtools();
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(system_tray_handler)
        .invoke_handler(tauri::generate_handler![
            get_cpu_metrics,
            get_memory_metrics,
            get_battery_metrics,
            get_process_metrics,
            get_system_metrics,
            update_tray_title
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/**
 * 处理系统托盘菜单项的点击事件
 */
fn system_tray_handler(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick {
            position: pos,
            size: _,
            ..
        } => {
            let window = app.get_window("main").unwrap();
            window.set_position(pos).unwrap();
            #[cfg(target_os = "windows")]
            window.center().unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                // 退出
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        }
        _ => {}
    }
}
