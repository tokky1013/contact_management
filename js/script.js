const STORAGE_KEY = "contacts_v1";

let contacts = [];

function addContact() {
    const newContact = {
        'startDate': $('#start-date').val(),
        'usagePeriod': $('#usage-period').val() - 0
    }

    contacts.push(newContact);
    if(saveContacts(contacts)) showContacts(contacts);
}

function showContacts(targetContacts) {
    function _startOfLocalDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }
    // ソート
    targetContacts.sort(function(a, b) {
        return new Date(a.startDate) > new Date(b.startDate) ? -1 : 1;
    });

    let html = `
        <tr>
            <th>使用開始日</th>
            <th>使用期限</th>
            <th>使用期間</th>
        </tr>
    `

    for (const contact of targetContacts) {
        const today = new Date();
        const startDate = new Date(contact.startDate);
        const expirationDate = new Date(contact.startDate);
        expirationDate.setDate(expirationDate.getDate() + contact.usagePeriod - 1);

        // 行のクラスを設定
        let rowClass;
        if(_startOfLocalDay(today) < _startOfLocalDay(expirationDate)) rowClass = 'is-valid';
        else if(_startOfLocalDay(today) > _startOfLocalDay(expirationDate)) rowClass = 'is-expired';
        else rowClass = 'is-due-today';

        let usagePeriod;
        if(contact.usagePeriod == 14) usagePeriod = '2week';
        else if(contact.usagePeriod == 30) usagePeriod = '1month';
        else usagePeriod = `${contact.usagePeriod}day`;

        html += `
            <tr class="${rowClass}">
                <td>${formatDate(startDate)}</td>
                <td>${formatDate(expirationDate)}</td>
                <td>${usagePeriod}</td>
            </tr>
        `
    }

    $('#contacts').html(html);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// データの保存
function saveContacts(targetContacts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(targetContacts));
        return true;
    } catch (error) {
        alert("データの追加に失敗しました");
        console.error("localStorageへの保存に失敗しました:", error);
        return false;
    }
}

// データの読み込み
function loadContacts(defaultRows = []) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return defaultRows;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : defaultRows;
    } catch (error) {
        alert("データの読み込みに失敗しました");
        console.error("localStorageからの読み込みに失敗しました:", error);
        return defaultRows;
  }
}

$(function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    $('#start-date').val(formattedDate);

    contacts = loadContacts();
    showContacts(contacts);
});