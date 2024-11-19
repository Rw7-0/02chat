// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2PBCYfmVxgnycjNu3Rm-HXdu4PTi5iQY",
    authDomain: "chat-30651.firebaseapp.com",
    projectId: "chat-30651",
    storageBucket: "chat-30651.firebasestorage.app",
    messagingSenderId: "561401737175",
    appId: "1:561401737175:web:1d3542ab6283aad6b12592",
    measurementId: "G-5FQFXZ0CHQ",
    databaseURL: "https://chat-30651-default-rtdb.firebaseio.com"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// المتغيرات الأساسية
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const onlineUsersSpan = document.getElementById('online-users');

// إنشاء معرف فريد للمستخدم
const userId = 'user_' + Math.random().toString(36).substr(2, 9);

// تحديث حالة الاتصال
const userStatusRef = database.ref('status/' + userId);
userStatusRef.set(true);
userStatusRef.onDisconnect().remove();

// متابعة عدد المستخدمين المتصلين
database.ref('status').on('value', (snapshot) => {
    const connectedUsers = snapshot.numChildren();
    onlineUsersSpan.textContent = connectedUsers;
});

// إرسال الرسائل
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        database.ref('messages').push({
            userId: userId,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = '';
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// عرض الرسائل
database.ref('messages').on('child_added', (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(message.userId === userId ? 'sent' : 'received');
    messageElement.textContent = message.text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});