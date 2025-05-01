// Ultimate Student Toolkit - Study Group Chat

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userProfile = document.getElementById('user-profile');
    const loginSection = document.getElementById('login-section');
    const profileSection = document.getElementById('profile-section');
    const usernameInput = document.getElementById('username-input');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const createGroupBtn = document.getElementById('create-group-btn');
    const searchGroups = document.getElementById('search-groups');
    const groupsList = document.getElementById('groups-list');
    const onlineUsers = document.getElementById('online-users');
    const currentGroupName = document.getElementById('current-group-name');
    const currentGroupDescription = document.getElementById('current-group-description');
    const shareFilesBtn = document.getElementById('share-files-btn');
    const groupInfoBtn = document.getElementById('group-info-btn');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const emojiBtn = document.getElementById('emoji-btn');
    const attachBtn = document.getElementById('attach-btn');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const attachmentPreview = document.getElementById('attachment-preview');
    const attachmentName = document.getElementById('attachment-name');
    const removeAttachment = document.getElementById('remove-attachment');
    const loginPrompt = document.getElementById('login-prompt');
    const messageInputContainer = document.getElementById('message-input-container');
    
    // Modals
    const createGroupModal = document.getElementById('create-group-modal');
    const closeCreateGroup = document.getElementById('close-create-group');
    const cancelCreateGroup = document.getElementById('cancel-create-group');
    const confirmCreateGroup = document.getElementById('confirm-create-group');
    const groupName = document.getElementById('group-name');
    const groupDescription = document.getElementById('group-description');
    const groupTopic = document.getElementById('group-topic');
    const groupPrivate = document.getElementById('group-private');
    
    const groupInfoModal = document.getElementById('group-info-modal');
    const closeGroupInfo = document.getElementById('close-group-info');
    const infoGroupName = document.getElementById('info-group-name');
    const infoGroupDescription = document.getElementById('info-group-description');
    
    // App State
    let currentUser = null;
    let currentGroup = 'general';
    let currentAttachment = null;
    let groups = [
        {
            id: 'general',
            name: 'General Discussion',
            description: 'Open to all students',
            topic: 'general',
            isPrivate: false,
            creator: 'admin',
            members: 12,
            messages: []
        },
        {
            id: 'math',
            name: 'Math Study Group',
            description: 'Calculus, Algebra, Statistics',
            topic: 'math',
            isPrivate: false,
            creator: 'admin',
            members: 5,
            messages: []
        },
        {
            id: 'cs',
            name: 'Computer Science',
            description: 'Programming, Algorithms, AI',
            topic: 'cs',
            isPrivate: false,
            creator: 'admin',
            members: 8,
            messages: []
        }
    ];
    
    // Sample users
    const users = [
        { id: 'alex', name: 'Alex', avatar: 'A', color: 'bg-purple-500', online: true },
        { id: 'jamie', name: 'Jamie', avatar: 'J', color: 'bg-blue-500', online: true },
        { id: 'sam', name: 'Sam', avatar: 'S', color: 'bg-pink-500', online: true }
    ];
    
    // Initialize
    function init() {
        // Check for saved user
        const savedUser = localStorage.getItem('studyGroupChatUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUserProfile();
        }
        
        // Event listeners
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        createGroupBtn.addEventListener('click', openCreateGroupModal);
        closeCreateGroup.addEventListener('click', closeCreateGroupModal);
        cancelCreateGroup.addEventListener('click', closeCreateGroupModal);
        confirmCreateGroup.addEventListener('click', handleCreateGroup);
        groupInfoBtn.addEventListener('click', openGroupInfoModal);
        closeGroupInfo.addEventListener('click', closeGroupInfoModal);
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        attachBtn.addEventListener('click', handleAttachment);
        removeAttachment.addEventListener('click', removeAttachmentFile);
        searchGroups.addEventListener('input', filterGroups);
        
        // Set up group click handlers
        setupGroupClickHandlers();
        
        // Update UI based on login state
        updateUIForLoginState();
    }
    
    // Handle login
    function handleLogin() {
        const username = usernameInput.value.trim();
        if (username) {
            // Create user object
            const userInitial = username.charAt(0).toUpperCase();
            const randomColors = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
            const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
            
            currentUser = {
                id: username.toLowerCase().replace(/\s+/g, '-'),
                name: username,
                avatar: userInitial,
                color: randomColor,
                online: true
            };
            
            // Save to local storage
            localStorage.setItem('studyGroupChatUser', JSON.stringify(currentUser));
            
            // Update UI
            updateUserProfile();
            updateUIForLoginState();
            
            // Add user to online users
            addUserToOnlineList(currentUser);
            
            // Show welcome message
            showSystemMessage(`Welcome to the chat, ${currentUser.name}!`);
        }
    }
    
    // Handle logout
    function handleLogout() {
        // Show logout message
        showSystemMessage(`${currentUser.name} has left the chat.`);
        
        // Remove user from storage
        localStorage.removeItem('studyGroupChatUser');
        currentUser = null;
        
        // Update UI
        updateUIForLoginState();
    }
    
    // Update user profile display
    function updateUserProfile() {
        if (currentUser) {
            loginSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
            
            userAvatar.textContent = currentUser.avatar;
            userAvatar.className = `w-12 h-12 rounded-full ${currentUser.color} flex items-center justify-center text-white text-xl font-bold`;
            userName.textContent = currentUser.name;
        } else {
            loginSection.classList.remove('hidden');
            profileSection.classList.add('hidden');
        }
    }
    
    // Update UI based on login state
    function updateUIForLoginState() {
        if (currentUser) {
            messageInputContainer.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
            createGroupBtn.disabled = false;
            createGroupBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            messageInputContainer.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            createGroupBtn.disabled = true;
            createGroupBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
    
    // Add user to online users list
    function addUserToOnlineList(user) {
        // Check if user already exists
        const existingUser = document.querySelector(`#online-users [data-user-id="${user.id}"]`);
        if (existingUser) return;
        
        const userElement = document.createElement('div');
        userElement.className = 'flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50';
        userElement.dataset.userId = user.id;
        userElement.innerHTML = `
            <div class="w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-sm font-bold">${user.avatar}</div>
            <span class="text-gray-800">${user.name}</span>
            <span class="ml-auto text-xs text-green-600"><i class="fas fa-circle text-xs"></i></span>
        `;
        
        onlineUsers.appendChild(userElement);
    }
    
    // Setup group click handlers
    function setupGroupClickHandlers() {
        const groupItems = document.querySelectorAll('.group-item');
        groupItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Remove active class from all groups
                groupItems.forEach(g => g.classList.remove('active', 'bg-gray-50', 'bg-indigo-50'));
                groupItems.forEach(g => g.classList.add('hover:bg-indigo-50'));
                
                // Add active class to clicked group
                item.classList.add('active', 'bg-indigo-50');
                item.classList.remove('hover:bg-indigo-50');
                
                // Update current group
                currentGroup = groups[index].id;
                currentGroupName.textContent = groups[index].name;
                currentGroupDescription.textContent = groups[index].description;
                
                // Clear messages and show welcome message
                messagesContainer.innerHTML = '';
                showWelcomeMessage(groups[index].name);
                
                // Load messages for this group (in a real app, this would fetch from a server)
                loadGroupMessages(currentGroup);
            });
        });
    }
    
    // Filter groups based on search
    function filterGroups() {
        const searchTerm = searchGroups.value.toLowerCase();
        const groupItems = document.querySelectorAll('.group-item');
        
        groupItems.forEach((item, index) => {
            const groupName = groups[index].name.toLowerCase();
            const groupDesc = groups[index].description.toLowerCase();
            
            if (groupName.includes(searchTerm) || groupDesc.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
    
    // Open create group modal
    function openCreateGroupModal() {
        if (!currentUser) return;
        createGroupModal.classList.remove('hidden');
    }
    
    // Close create group modal
    function closeCreateGroupModal() {
        createGroupModal.classList.add('hidden');
        // Reset form
        groupName.value = '';
        groupDescription.value = '';
        groupTopic.value = 'general';
        groupPrivate.checked = false;
    }
    
    // Handle create group
    function handleCreateGroup() {
        const name = groupName.value.trim();
        const description = groupDescription.value.trim();
        const topic = groupTopic.value;
        const isPrivate = groupPrivate.checked;
        
        if (name) {
            // Create new group
            const newGroup = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name: name,
                description: description || 'No description provided',
                topic: topic,
                isPrivate: isPrivate,
                creator: currentUser.id,
                members: 1, // Just the creator initially
                messages: []
            };
            
            // Add to groups array
            groups.push(newGroup);
            
            // Add to UI
            addGroupToList(newGroup);
            
            // Close modal
            closeCreateGroupModal();
            
            // Show success message
            showSystemMessage(`New group "${name}" created!`);
        }
    }
    
    // Add group to the list
    function addGroupToList(group) {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item p-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition duration-300';
        groupItem.innerHTML = `
            <div class="flex justify-between items-center">
                <h4 class="font-medium text-gray-800">${group.name}</h4>
                <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">${group.members} online</span>
            </div>
            <p class="text-sm text-gray-600 truncate">${group.description}</p>
        `;
        
        // Add click handler
        groupItem.addEventListener('click', () => {
            // Remove active class from all groups
            const groupItems = document.querySelectorAll('.group-item');
            groupItems.forEach(g => g.classList.remove('active', 'bg-gray-50', 'bg-indigo-50'));
            groupItems.forEach(g => g.classList.add('hover:bg-indigo-50'));
            
            // Add active class to clicked group
            groupItem.classList.add('active', 'bg-indigo-50');
            groupItem.classList.remove('hover:bg-indigo-50');
            
            // Update current group
            currentGroup = group.id;
            currentGroupName.textContent = group.name;
            currentGroupDescription.textContent = group.description;
            
            // Clear messages and show welcome message
            messagesContainer.innerHTML = '';
            showWelcomeMessage(group.name);
        });
        
        groupsList.appendChild(groupItem);
    }
    
    // Open group info modal
    function openGroupInfoModal() {
        const group = groups.find(g => g.id === currentGroup);
        if (group) {
            infoGroupName.textContent = group.name;
            infoGroupDescription.textContent = group.description;
            groupInfoModal.classList.remove('hidden');
        }
    }
    
    // Close group info modal
    function closeGroupInfoModal() {
        groupInfoModal.classList.add('hidden');
    }
    
    // Handle attachment
    function handleAttachment() {
        // In a real app, this would open a file picker
        // For demo purposes, we'll simulate selecting a file
        const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'png'];
        const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const fileName = `sample_file.${randomType}`;
        const fileSize = (Math.random() * 5 + 0.5).toFixed(1); // Random size between 0.5 and 5.5 MB
        
        currentAttachment = {
            name: fileName,
            type: randomType,
            size: `${fileSize} MB`
        };
        
        // Show attachment preview
        attachmentName.textContent = fileName;
        attachmentPreview.classList.remove('hidden');
    }
    
    // Remove attachment
    function removeAttachmentFile() {
        currentAttachment = null;
        attachmentPreview.classList.add('hidden');
    }
    
    // Send message
    function sendMessage() {
        if (!currentUser) return;
        
        const messageText = messageInput.value.trim();
        if (messageText || currentAttachment) {
            // Create message object
            const message = {
                id: Date.now().toString(),
                sender: currentUser,
                text: messageText,
                attachment: currentAttachment,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // Add to UI
            addMessageToUI(message, true);
            
            // In a real app, this would send to a server
            // For demo, we'll just add to the current group's messages
            const group = groups.find(g => g.id === currentGroup);
            if (group) {
                group.messages.push(message);
            }
            
            // Clear input and attachment
            messageInput.value = '';
            if (currentAttachment) {
                removeAttachmentFile();
            }
            
            // Simulate response after a short delay
            if (messageText) {
                simulateResponse();
            }
        }
    }
    
    // Add message to UI
    function addMessageToUI(message, isOwn = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isOwn ? 'my-message' : 'other-message'} mb-4`;
        
        let messageHTML = '';
        
        if (isOwn) {
            messageHTML = `
                <div class="flex items-start justify-end">
                    <div>
                        <div class="flex items-center justify-end">
                            <span class="text-xs text-gray-500 mr-2">${message.timestamp}</span>
                            <span class="font-medium text-gray-800">${message.sender.name}</span>
                        </div>
                        ${message.text ? `<div class="bg-gradient-to-r from-indigo-100 to-blue-100 p-3 rounded-lg shadow-sm mt-1 max-w-md">
                            <p class="text-gray-800">${message.text}</p>
                        </div>` : ''}
                        ${message.attachment ? renderAttachment(message.attachment, isOwn) : ''}
                    </div>
                    <div class="w-8 h-8 rounded-full ${message.sender.color} flex items-center justify-center text-white text-sm font-bold ml-2">${message.sender.avatar}</div>
                </div>
            `;
        } else {
            messageHTML = `
                <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full ${message.sender.color} flex items-center justify-center text-white text-sm font-bold mr-2">${message.sender.avatar}</div>
                    <div>
                        <div class="flex items-center">
                            <span class="font-medium text-gray-800 mr-2">${message.sender.name}</span>
                            <span class="text-xs text-gray-500">${message.timestamp}</span>
                        </div>
                        ${message.text ? `<div class="bg-white p-3 rounded-lg shadow-sm mt-1 max-w-md">
                            <p class="text-gray-800">${message.text}</p>
                        </div>` : ''}
                        ${message.attachment ? renderAttachment(message.attachment, isOwn) : ''}
                    </div>
                </div>
            `;
        }
        
        messageElement.innerHTML = messageHTML;
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Render attachment
    function renderAttachment(attachment, isOwn) {
        let iconClass = 'fa-file';
        let colorClass = 'text-gray-500';
        
        // Set icon based on file type
        if (attachment.type === 'pdf') {
            iconClass = 'fa-file-pdf';
            colorClass = 'text-red-500';
        } else if (attachment.type === 'docx') {
            iconClass = 'fa-file-word';
            colorClass = 'text-blue-500';
        } else if (attachment.type === 'xlsx') {
            iconClass = 'fa-file-excel';
            colorClass = 'text-green-500';
        } else if (attachment.type === 'jpg' || attachment.type === 'png') {
            iconClass = 'fa-file-image';
            colorClass = 'text-purple-500';
        }
        
        return `
            <div class="${isOwn ? 'bg-gradient-to-r from-indigo-100 to-blue-100' : 'bg-white'} p-3 rounded-lg shadow-sm mt-1 max-w-md flex items-center">
                <i class="fas ${iconClass} ${colorClass} text-xl mr-2"></i>
                <div>
                    <p class="text-gray-800 font-medium">${attachment.name}</p>
                    <p class="text-xs text-gray-500">${attachment.size}</p>
                </div>
                <button class="ml-auto p-1 text-blue-600 hover:text-blue-800">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
    }
    
    // Show welcome message
    function showWelcomeMessage(groupName) {
        const welcomeElement = document.createElement('div');
        welcomeElement.className = 'text-center py-4';
        welcomeElement.innerHTML = `
            <div class="inline-block p-3 rounded-lg bg-indigo-100 text-indigo-800 mb-2">
                <i class="fas fa-users text-xl"></i>
            </div>
            <h4 class="font-semibold text-gray-800">Welcome to ${groupName}</h4>
            <p class="text-sm text-gray-600">This is the start of the conversation</p>
        `;
        
        messagesContainer.appendChild(welcomeElement);
    }
    
    // Show system message
    function showSystemMessage(message) {
        const systemElement = document.createElement('div');
        systemElement.className = 'text-center py-2';
        systemElement.innerHTML = `
            <p class="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full inline-block">${message}</p>
        `;
        
        messagesContainer.appendChild(systemElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Load group messages
    function loadGroupMessages(groupId) {
        const group = groups.find(g => g.id === groupId);
        if (group && group.messages.length > 0) {
            group.messages.forEach(message => {
                const isOwn = currentUser && message.sender.id === currentUser.id;
                addMessageToUI(message, isOwn);
            });
        }
    }
    
    // Simulate response
    function simulateResponse() {
        setTimeout(() => {
            // Pick a random user to respond
            const responder = users[Math.floor(Math.random() * users.length)];
            
            // Create response message
            const responses = [
                "That's a great point!",
                "I agree with you.",
                "Could you explain that in more detail?",
                "I'm not sure I understand. Can you clarify?",
                "That's interesting! I hadn't thought of it that way.",
                "Does anyone have additional resources on this topic?",
                "I found this really helpful article about that.",
                "When is the assignment due again?",
                "Has anyone started working on the project yet?",
                "Thanks for sharing!"
            ];
            
            const responseText = responses[Math.floor(Math.random() * responses.length)];
            
            const message = {
                id: Date.now().toString(),
                sender: responder,
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // Add to UI
            addMessageToUI(message, false);
            
            // Add to group messages
            const group = groups.find(g => g.id === currentGroup);
            if (group) {
                group.messages.push(message);
            }
        }, 1500 + Math.random() * 2000); // Random delay between 1.5 and 3.5 seconds
    }
    
    // Initialize the app
    init();
});

// Initialize 3D animation when the page loads
window.addEventListener('load', () => {
    if (typeof init === 'function') {
        init(); // From animation.js
    }
});