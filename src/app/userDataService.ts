const LocalStorageKey = "gkc-user-data"

export function saveData(data: any) {
    window.localStorage.setItem(LocalStorageKey, JSON.stringify(data))
}

export function loadData(): any {
    const serializedData = window.localStorage.getItem(LocalStorageKey)
    return serializedData != null ? JSON.parse(serializedData) : null
}

export function clearData() {
    window.localStorage.removeItem(LocalStorageKey)
}