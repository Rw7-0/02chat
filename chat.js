// تهيئة Firebase - استبدل هذه البيانات ببيانات مشروعك من Firebase
const firebaseConfig = {
    apiKey: "ضع_API_Key_هنا",
    authDomain: "اسم_مشروعك.firebaseapp.com",
    databaseURL: "https://اسم_مشروعك.firebaseio.com",
    projectId: "اسم_مشروعك",
    storageBucket: "اسم_مشروعك.appspot.com",
    messagingSenderId: "رقم_المرسل",
    appId: "معرف_التطبيق"
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

// إضافة مستمعي الأحداث
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

// حذف الرسائل القديمة كل ساعة
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    database.ref('messages')
        .orderByChild('timestamp')
        .endAt(oneHourAgo)
        .once('value', (snapshot) => {
            snapshot.forEach((child) => {
                child.ref.remove();
            });
        });
}, 60 * 60 * 1000); 