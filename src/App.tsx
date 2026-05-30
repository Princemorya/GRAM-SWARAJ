/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Incident, 
  UserProfile, 
  SystemNotification,
  IncidentCategory,
  Severity,
  IncidentStatus,
  UserRole,
  IssueComment,
  ProgressUpdate,
  MarketplaceItem,
  MarketplaceCategory,
  GroupMessage,
  SubgroupType,
  EmergencyBroadcast,
  VillageCommunity
} from './types';
import { INITIAL_COMMUNITIES, INITIAL_INCIDENTS, INITIAL_MARKETPLACE, INITIAL_GROUP_MESSAGES, INITIAL_BROADCASTS } from './utils/initialData';
import { 
  seedInitialDataIfEmpty, 
  subscribeCollection, 
  saveRecord, 
  updateRecord, 
  deleteRecord 
} from './lib/firebaseSync';
import { ensureSilentAuth } from './lib/firebase';
import { LANGUAGES_SUPPORTED, DICTIONARY } from './utils/langData';
import { ALL_INDIAN_STATES, getDistricts, getDefaultVillages } from './utils/indiaGeography';
import { 
  Phone, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Plus, 
  CheckCircle,
  AlertTriangle,
  Send,
  Eye,
  EyeOff,
  User,
  MapPin,
  Clock,
  ThumbsUp,
  Sliders,
  ChevronRight,
  Shield,
  Bell,
  X,
  Share2,
  Lock,
  Search,
  Check,
  Smartphone,
  Sparkles,
  HelpCircle,
  Languages,
  ArrowRight,
  FileText,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  // ----------------------------------------------------
  // Theme state (Supports light and dark theme modes)
  // ----------------------------------------------------
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('grams_theme') !== 'light';
  });

  useEffect(() => {
    localStorage.setItem('grams_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // ----------------------------------------------------
  // Localization state (Supports 20 major Indian & global languages)
  // ----------------------------------------------------
  const [lang, setLang] = useState<string>(() => localStorage.getItem('grams_lang') || 'hi');

  const t = useMemo(() => {
    return DICTIONARY[lang] || DICTIONARY['en'];
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('grams_lang', lang);
  }, [lang]);

  // ----------------------------------------------------
  // Main Persistent States
  // ----------------------------------------------------
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('grams_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('grams_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(() => {
    const saved = localStorage.getItem('grams_group_messages');
    return saved ? JSON.parse(saved) : INITIAL_GROUP_MESSAGES;
  });

  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>(() => {
    const saved = localStorage.getItem('grams_broadcasts');
    return saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('grams_notifications');
    const defaultNotifs: SystemNotification[] = [
      {
        id: 'not_1',
        title: 'Platform Online (ग्रामस्वराज सुरक्षित)',
        message: 'Phone OTP security simulation is active. Select "Profile" to change personas or log in.',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system'
      }
    ];
    return saved ? JSON.parse(saved) : defaultNotifs;
  });

  // ----------------------------------------------------
  // Active Navigation & View Options
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'market' | 'groups' | 'profile'>('home');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('all_district'); 
  
  // ----------------------------------------------------
  // Persistent State for Villages / Communities (State & District Hierarchy)
  // ----------------------------------------------------
  const [villages, setVillages] = useState<VillageCommunity[]>(() => {
    const saved = localStorage.getItem('grams_villages');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  // ----------------------------------------------------
  // Persistent Roster of Users (DMs, Pradhans & Villagers)
  // ----------------------------------------------------
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('grams_all_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        uid: 'user_resident_1',
        name: 'Amit Patel',
        phone: '+91 94501 23456',
        role: 'Resident',
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        uid: 'user_resident_2',
        name: 'Sanjay Yadav',
        phone: '+91 91223 34455',
        role: 'Resident',
        villageId: 'up_faridpur',
        isVerified: true,
        joinedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        uid: 'user_resident_3',
        name: 'Vijay Maurya',
        phone: '+91 99887 76655',
        role: 'Resident',
        villageId: 'up_baheri',
        isVerified: false,
        joinedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        uid: 'user_pradhan_1',
        name: 'Pradhan Rajesh Kumar',
        phone: '+91 98765 43210',
        role: 'Gram Pradhan',
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        uid: 'user_pradhan_2',
        name: 'Pradhan Shanti Devi',
        phone: '+91 94567 11223',
        role: 'Gram Pradhan',
        villageId: 'up_faridpur',
        isVerified: true,
        joinedAt: new Date(Date.now() - 12 * 86400000).toISOString()
      },
      {
        uid: 'user_dm_1',
        name: 'Shri Manoj Kumar (DM Bareilly)',
        phone: '+91 91122 33445',
        role: 'DM',
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date(Date.now() - 30 * 86400000).toISOString()
      }
    ];
  });

  // Provide all 28 states and 8 union territories of India!
  const statesList = ALL_INDIAN_STATES;

  // Active state-wide & district-wide browsing portals
  const [browseState, setBrowseState] = useState<string>('Uttar Pradesh');
  const [browseDistrict, setBrowseDistrict] = useState<string>('Bareilly');

  const browseDistrictsList = useMemo(() => {
    return getDistricts(browseState);
  }, [browseState]);

  const browseVillagesList = useMemo(() => {
    return villages.filter(v => v.state === browseState && v.district === browseDistrict);
  }, [villages, browseState, browseDistrict]);

  // Sign-up cascading state configurations
  const [signupState, setSignupState] = useState<string>('Uttar Pradesh');
  const [signupDistrict, setSignupDistrict] = useState<string>('Bareilly');
  const [signupVillageId, setSignupVillageId] = useState<string>('up_baheri');

  const signupDistrictsList = useMemo(() => {
    return getDistricts(signupState);
  }, [signupState]);

  const signupVillagesList = useMemo(() => {
    return villages.filter(v => v.state === signupState && v.district === signupDistrict);
  }, [villages, signupState, signupDistrict]);

  // Self-seeding Hook: Whenever browsing state/district has no registered villages, automatically seed them!
  useEffect(() => {
    if (browseState && browseDistrict) {
      const existing = villages.filter(v => v.state === browseState && v.district === browseDistrict);
      if (existing.length === 0) {
        const defaults = getDefaultVillages(browseState, browseDistrict);
        if (defaults && defaults.length > 0) {
          setVillages(prev => {
            const alreadyHeaded = prev.some(v => v.state === browseState && v.district === browseDistrict);
            if (alreadyHeaded) return prev;
            return [...prev, ...defaults];
          });
        }
      }
    }
  }, [browseState, browseDistrict, villages]);

  // Self-seeding Hook: Whenever signup state/district has no registered villages, automatically seed them!
  useEffect(() => {
    if (signupState && signupDistrict) {
      const existing = villages.filter(v => v.state === signupState && v.district === signupDistrict);
      if (existing.length === 0) {
        const defaults = getDefaultVillages(signupState, signupDistrict);
        if (defaults && defaults.length > 0) {
          setVillages(prev => {
            const alreadyHeaded = prev.some(v => v.state === signupState && v.district === signupDistrict);
            if (alreadyHeaded) return prev;
            return [...prev, ...defaults];
          });
        }
      }
    }
  }, [signupState, signupDistrict, villages]);

  // Custom Village Addition triggers inside signup form
  const [isAddCustomVillage, setIsAddCustomVillage] = useState<boolean>(false);
  const [customVillageState, setCustomVillageState] = useState<string>('');
  const [customVillageDistrict, setCustomVillageDistrict] = useState<string>('');
  const [customVillageName, setCustomVillageName] = useState<string>('');

  // District Magistrate control portal states
  const [dmNewVillageName, setDmNewVillageName] = useState<string>('');
  const [dmNewDistrict, setDmNewDistrict] = useState<string>('Bareilly');
  const [dmNewState, setDmNewState] = useState<string>('Uttar Pradesh');

  // Active subgroup within Groups tab
  const [activeGroup, setActiveGroup] = useState<SubgroupType>('Farmers');

  // Search/Filters states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMarketCategory, setSelectedMarketCategory] = useState<string>('All');

  // ----------------------------------------------------
  // User Authentication State Simulation (Starts as null to show login/signup pages)
  // ----------------------------------------------------
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Starts as null to provide pristine login / signup screens as requested
    return null;
  });

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [loginPhone, setLoginPhone] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Phone validation inputs
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSentFlag, setOtpSentFlag] = useState(false);
  const [userRegisterType, setUserRegisterType] = useState<UserRole>('Resident');
  const [regNameInput, setRegNameInput] = useState('');

  // Form Inputs
  // Report Form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<IncidentCategory>('Water');
  const [newSeverity, setNewSeverity] = useState<Severity>('Medium');
  const [newImage, setNewImage] = useState<string>('');
  const [reportAnonymously, setReportAnonymously] = useState<boolean>(false);
  const [pinX, setPinX] = useState<number>(45);
  const [pinY, setPinY] = useState<number>(30);
  const [isSettingPin, setIsSettingPin] = useState(false);

  // Marketplace Form
  const [showAddListing, setShowAddListing] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listCategory, setListCategory] = useState<MarketplaceCategory>('Goods');
  const [listImage, setListImage] = useState('');

  // Comment Form
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Group message input
  const [messageText, setMessageText] = useState('');
  const [messageAnonymous, setMessageAnonymous] = useState(false);

  // Broadcaster Form (Admin / Pradhan only)
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'Immediate' | 'Important' | 'General'>('Immediate');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  // Pradhan Issue Status Modification Note
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<Incident | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<IncidentStatus>('Investigating');
  const [dispatchNotes, setDispatchNotes] = useState('');

  // Notification Banner indicator
  const [showingNotifSlider, setShowingNotifSlider] = useState(false);

  // Local Ticking Clock
  const [currentTimeStr, setCurrentTimeStr] = useState('17:05');

  // ----------------------------------------------------
  // Firebase Real-time Synchronization & Database Seeding
  // ----------------------------------------------------
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initFirebaseSync = async () => {
      try {
        // Step 1. Ensure anonymous authentication is active for database compliance
        await ensureSilentAuth();

        // Step 2. Auto-seed core Firestore collections if empty
        await seedInitialDataIfEmpty();

        // Step 3. Set up listeners
        const unsubIncidents = subscribeCollection<Incident>('incidents', (items) => {
          const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setIncidents(sorted);
        });
        unsubs.push(unsubIncidents);

        const unsubMarket = subscribeCollection<MarketplaceItem>('marketplace', (items) => {
          const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setMarketplace(sorted);
        });
        unsubs.push(unsubMarket);

        const unsubGroup = subscribeCollection<GroupMessage>('groupMessages', (items) => {
          const sorted = [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setGroupMessages(sorted);
        });
        unsubs.push(unsubGroup);

        const unsubBroadcasts = subscribeCollection<EmergencyBroadcast>('broadcasts', (items) => {
          const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBroadcasts(sorted);
        });
        unsubs.push(unsubBroadcasts);

        const unsubNotifications = subscribeCollection<SystemNotification>('notifications', (items) => {
          const sorted = [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setNotifications(sorted);
        });
        unsubs.push(unsubNotifications);

        const unsubVillages = subscribeCollection<VillageCommunity>('villages', (items) => {
          if (items.length > 0) {
            setVillages(items);
          }
        });
        unsubs.push(unsubVillages);

        const unsubUsers = subscribeCollection<UserProfile>('users', (items) => {
          if (items.length > 0) {
            setAllUsers(items);
          }
        });
        unsubs.push(unsubUsers);
      } catch (err) {
        console.warn("Firebase startup synchronization warning: ", err);
      }
    };

    initFirebaseSync();

    return () => {
      unsubs.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {
          // ignore cleanup errors
        }
      });
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('grams_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('grams_marketplace', JSON.stringify(marketplace));
  }, [marketplace]);

  useEffect(() => {
    localStorage.setItem('grams_group_messages', JSON.stringify(groupMessages));
  }, [groupMessages]);

  useEffect(() => {
    localStorage.setItem('grams_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem('grams_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('grams_villages', JSON.stringify(villages));
  }, [villages]);

  // Synchronize browseState and browseDistrict when selectedVillageId changes so dropdown options are correctly visible
  useEffect(() => {
    if (selectedVillageId && selectedVillageId !== 'all_district') {
      const targetV = villages.find(v => v.id === selectedVillageId);
      if (targetV) {
        if (targetV.state && targetV.state !== browseState) {
          setBrowseState(targetV.state);
        }
        if (targetV.district && targetV.district !== browseDistrict) {
          setBrowseDistrict(targetV.district);
        }
      }
    }
  }, [selectedVillageId, villages, browseState, browseDistrict]);

  useEffect(() => {
    localStorage.setItem('grams_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------
  // Business logic: UPVOTE ("I have this problem too")
  // ----------------------------------------------------
  const handleUpvote = async (incidentId: string) => {
    if (!currentUser) {
      triggerNotification('Authorization', 'You must log in using your Phone number to upvote.', 'system');
      return;
    }

    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const isUpvoted = inc.upvotedBy.includes(currentUser.phone);
    const updatedUpvotedBy = isUpvoted
      ? inc.upvotedBy.filter(ph => ph !== currentUser.phone)
      : [...inc.upvotedBy, currentUser.phone];
    const updatedUpvotes = isUpvoted ? inc.upvotes - 1 : inc.upvotes + 1;

    try {
      await updateRecord('incidents', incidentId, {
        upvotes: updatedUpvotes,
        upvotedBy: updatedUpvotedBy
      });
    } catch (err) {
      console.error("Failed upvote: ", err);
    }
  };

  // ----------------------------------------------------
  // Business logic: ADD ISSUE RESOLUTION (Pradhan)
  // ----------------------------------------------------
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForUpdate || !currentUser) return;

    const progress: ProgressUpdate = {
      id: `prog_${Date.now()}`,
      updaterName: currentUser.name,
      status: updatedStatus,
      notes: dispatchNotes || `Status updated to ${updatedStatus} by Gram Pradhan.`,
      timestamp: new Date().toISOString()
    };

    const prevUpdates = selectedIncidentForUpdate.progressUpdates || [];
    try {
      await updateRecord('incidents', selectedIncidentForUpdate.id, {
        status: updatedStatus,
        updatedAt: new Date().toISOString(),
        progressUpdates: [...prevUpdates, progress]
      });

      // Trigger Zapier/Make Automation simulator for webhook resolved notification
      if (updatedStatus === 'Resolved') {
        const smsText = `✅ Hello ${selectedIncidentForUpdate.reporterName || 'Villager'}, Gram Pradhan Rajesh Kumar has marked your reported issue "${selectedIncidentForUpdate.title.slice(0, 30)}..." as RESOLVED. Progress update: ${dispatchNotes}. Thank you for cooperative civic growth!`;
        
        triggerNotification(
          'WhatsApp/SMS Redirection', 
          smsText,
          'whatsapp'
        );
      } else {
        triggerNotification(
          'Progress Note Logged',
          `Grievance status changed to ${updatedStatus}. Timeline logs synchronized.`,
          'system'
        );
      }
    } catch (err) {
      console.error("Failed status update: ", err);
    }

    // Reset modal
    setSelectedIncidentForUpdate(null);
    setDispatchNotes('');
  };

  // ----------------------------------------------------
  // Business logic: POST NEW ISSUE
  // ----------------------------------------------------
  const handleReportGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerNotification('Auth Required', 'Please complete Phone/OTP check in the Profile section.', 'system');
      return;
    }
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newIncident: Incident = {
      id: `inc_${Date.now()}`,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      severity: newSeverity,
      status: 'Pending',
      villageId: (selectedVillageId && selectedVillageId !== 'all_district') ? selectedVillageId : (currentUser.villageId || 'up_baheri'),
      reporterName: reportAnonymously ? 'Anonymous' : currentUser.name,
      reporterPhone: currentUser.phone,
      reporterId: currentUser.uid,
      isAnonymous: reportAnonymously,
      imageUrl: newImage || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=600',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      comments: [],
      progressUpdates: []
    };

    try {
      await saveRecord('incidents', newIncident.id, newIncident);
      if (newIncident.villageId) {
        setSelectedVillageId(newIncident.villageId);
      }

      // Triggers automated SMS notification loop
      const alertMessage = `📢 [Grievance Filed] Resident filed a new ${newCategory} issue: "${newTitle}". Anonymous level: ${reportAnonymously ? 'HIGH' : 'LOW'}. Auto redirected to Gram Panchayat dispatcher.`;
      triggerNotification('Zapier Trigger: SMS dispatch', alertMessage, 'sms');
    } catch (err) {
      console.error("Grievance submission error: ", err);
    }

    // Reset form & change tab to home
    setNewTitle('');
    setNewDescription('');
    setNewImage('');
    setReportAnonymously(false);
    setActiveTab('home');
  };

  // ----------------------------------------------------
  // Business logic: ADD CLASSIFIED (Mandi Market)
  // ----------------------------------------------------
  const handleAddMarketplaceListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!listTitle.trim() || !listDesc.trim() || !listPrice.trim()) return;

    const newItem: MarketplaceItem & { villageId?: string } = {
      id: `m_${Date.now()}`,
      title: listTitle,
      description: listDesc,
      price: listPrice,
      category: listCategory,
      contactName: currentUser.name,
      contactPhone: currentUser.phone,
      imageUrl: listImage || 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      postedBy: currentUser.uid,
      villageId: (selectedVillageId && selectedVillageId !== 'all_district') ? selectedVillageId : (currentUser.villageId || 'up_baheri')
    };

    try {
      await saveRecord('marketplace', newItem.id, newItem);
      if (newItem.villageId) {
        setSelectedVillageId(newItem.villageId);
      }
      triggerNotification('Listing Posted (मंडी विज्ञापन)', 'Your classified entry is live on the village bulletin Board.', 'system');
    } catch (err) {
      console.error("Mandi listing error: ", err);
    }

    // Reset
    setListTitle('');
    setListDesc('');
    setListPrice('');
    setListImage('');
    setShowAddListing(false);
  };

  // ----------------------------------------------------
  // Business Logic: DISCUSSION FORUM MSG
  // ----------------------------------------------------
  const handleSendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !messageText.trim()) return;

    const newMsg: GroupMessage = {
      id: `msg_${Date.now()}`,
      group: activeGroup,
      senderName: messageAnonymous ? 'Anonymous' : currentUser.name,
      senderPhone: currentUser.phone,
      message: messageText,
      isAnonymous: messageAnonymous,
      createdAt: new Date().toISOString(),
      villageId: (selectedVillageId && selectedVillageId !== 'all_district') ? selectedVillageId : (currentUser.villageId || 'up_baheri')
    };

    try {
      await saveRecord('groupMessages', newMsg.id, newMsg);
      if (newMsg.villageId) {
        setSelectedVillageId(newMsg.villageId);
      }
    } catch (err) {
      console.error("Choupal msg error: ", err);
    }
    setMessageText('');
  };

  // ----------------------------------------------------
  // Business Logic: EMERGENCY BROADCAST ADDING
  // ----------------------------------------------------
  const handlePostEmergencyBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (currentUser.role !== 'Gram Pradhan' && currentUser.role !== 'DM' && currentUser.role !== 'Admin')) return;
    if (!broadcastTitle.trim() || !broadcastText.trim()) return;

    // DM can target entire district or specific village
    const targetVillageId = currentUser.role === 'DM'
      ? (selectedVillageId === 'all_district' ? undefined : selectedVillageId)
      : currentUser.villageId;

    const prefix = currentUser.role === 'DM' ? '🚨 [DM Executive Order / जिलाधिकारी आदेश]' : '📢 [Pradhan Broadcast / ग्राम प्रधान संदेश]';

    const newBc: EmergencyBroadcast = {
      id: `br_${Date.now()}`,
      title: `${prefix} ${broadcastTitle}`,
      message: broadcastText,
      createdAt: new Date().toISOString(),
      severity: broadcastSeverity,
      postedBy: currentUser.name,
      villageId: targetVillageId
    };

    try {
      await saveRecord('broadcasts', newBc.id, newBc);
      setShowBroadcastForm(false);
      setBroadcastTitle('');
      setBroadcastText('');

      // Trigger Zapier Whatsapp-SMS Broadcast Webhook
      const destination = targetVillageId 
        ? villages.find(v => v.id === targetVillageId)?.name || 'active village'
        : `${browseDistrict} district-wide`;

      triggerNotification(
        '🚨 SMS Broadcast Triggered 📢', 
        `Urgent alert dispatched to subscribers under ${destination}: "${broadcastTitle} - ${broadcastText.slice(0, 50)}..."`, 
        'sms'
      );
    } catch (err) {
      console.error("Broadcast submission error: ", err);
    }
  };

  // ----------------------------------------------------
  // Business logic: ADD ISSUE COMMENT
  // ----------------------------------------------------
  const handleAddComment = async (e: React.FormEvent, incidentId: string) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;

    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const newComm: IssueComment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      message: commentText,
      createdAt: new Date().toISOString()
    };

    const comms = inc.comments || [];
    try {
      await updateRecord('incidents', incidentId, {
        comments: [...comms, newComm]
      });
    } catch (err) {
      console.error("Failed to add comment: ", err);
    }

    setCommentText('');
    setActiveCommentId(null);
  };

  // Helper mock preloader for image submissions
  const handleQuickAttachMockPic = (category: string) => {
    let mockUrl = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600';
    if (category === 'Power') mockUrl = 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=600';
    if (category === 'Roads') mockUrl = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600';
    if (category === 'Waste') mockUrl = 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600';
    if (category === 'Medical') mockUrl = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600';
    
    setNewImage(mockUrl);
    triggerNotification('Photo Attached', 'Representative field photograph attached for Gram Panchayat inspection.', 'system');
  };

  // Helper trigger SMS alert mimicking system
  const triggerNotification = async (title: string, message: string, type: 'sms' | 'system' | 'whatsapp') => {
    const newNot: SystemNotification = {
      id: `not_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    try {
      await saveRecord('notifications', newNot.id, newNot);
      setShowingNotifSlider(true);
    } catch (err) {
      console.error("Failed to trigger notification: ", err);
    }
  };

  // Persona switch mechanism to simplify assessor triage
  const switchPersona = (role: UserRole) => {
    if (role === 'Resident') {
      const u = allUsers.find(x => x.uid === 'user_resident_1') || {
        uid: 'user_resident_1',
        name: 'Amit Patel',
        phone: '+91 94501 23456',
        role: 'Resident' as const,
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date().toISOString()
      };
      setCurrentUser(u);
      setSelectedVillageId(u.villageId);
      const targetVil = villages.find(v => v.id === u.villageId);
      if (targetVil) {
        setBrowseState(targetVil.state);
        setBrowseDistrict(targetVil.district);
      }
      triggerNotification('Persona Switched', `Signed in as Resident: ${u.name}. You can browse, file grievances and upvote local projects.`, 'system');
    } else if (role === 'Gram Pradhan') {
      const u = allUsers.find(x => x.uid === 'user_pradhan_1') || {
        uid: 'user_pradhan_1',
        name: 'Pradhan Rajesh Kumar',
        phone: '+91 98765 43210',
        role: 'Gram Pradhan' as const,
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date().toISOString()
      };
      setCurrentUser(u);
      setSelectedVillageId(u.villageId);
      const targetVil = villages.find(v => v.id === u.villageId);
      if (targetVil) {
        setBrowseState(targetVil.state);
        setBrowseDistrict(targetVil.district);
      }
      triggerNotification('Persona Switched', `Signed in as Pradhan: ${u.name}. You can status-triage, post alerts and manage resources.`, 'system');
    } else if (role === 'DM' || role === 'Admin') {
      const u = allUsers.find(x => x.role === 'DM') || {
        uid: 'user_dm_1',
        name: 'Shri Manoj Kumar (DM Bareilly)',
        phone: '+91 91122 33445',
        role: 'DM' as const,
        villageId: 'up_baheri',
        isVerified: true,
        joinedAt: new Date().toISOString()
      };
      setCurrentUser(u);
      setSelectedVillageId('all_district');
      const targetVil = villages.find(v => v.id === u.villageId);
      if (targetVil) {
        setBrowseState(targetVil.state);
        setBrowseDistrict(targetVil.district);
      }
      triggerNotification('Persona Switched', `Signed in as Bareilly District Magistrate (DM / Collector). Managing entire District.`, 'system');
    }
    setActiveTab('home');
  };

  // Secure Role-based Login Form Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim()) {
      setLoginError(lang === 'hi' ? 'कृपया फोन नंबर दर्ज करें' : 'Please enter your phone number.');
      return;
    }

    // Attempt to find user by matching end digits of phone (to ignore prefix variations)
    const normalizedTarget = loginPhone.replace(/\D/g, '');
    const foundUser = allUsers.find(u => {
      const normalizedUserPhone = u.phone.replace(/\D/g, '');
      return normalizedUserPhone === normalizedTarget || 
             (normalizedTarget.length >= 10 && normalizedUserPhone.endsWith(normalizedTarget.slice(-10)));
    });

    if (!foundUser) {
      setLoginError(
        lang === 'hi' 
          ? 'यह फोन नंबर पंजीकृत नहीं है। कृपया नया खाता बनाएं या नीचे दिए गए त्वरित परीक्षण बटनों का चयन करें।' 
          : 'Phone number not found in directory. Please register a new account or use the sandbox quick login buttons below.'
      );
      return;
    }

    if (loginPin !== '1234') {
      setLoginError(
        lang === 'hi' 
          ? 'गलत कोड दर्ज किया! परीक्षण के लिए पासकोड 1234 की आवश्यकता है।' 
          : 'Incorrect password pin. Please use 1234 for sandbox assessment.'
      );
      return;
    }

    setCurrentUser(foundUser);
    setSelectedVillageId(foundUser.villageId || 'all_district');
    const targetVil = villages.find(v => v.id === foundUser.villageId);
    if (targetVil) {
      setBrowseState(targetVil.state);
      setBrowseDistrict(targetVil.district);
    }
    
    // Reset inputs
    setLoginPhone('');
    setLoginPin('');
    setLoginError('');
    triggerNotification('User Authenticated', `Welcome back, ${foundUser.role}: ${foundUser.name}! Dashboard initialized.`, 'system');
  };

  // Phone OTP Flow mock triggers
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      alert("Please enter a valid 10-digit Indian phone number starting with +91 or standard code.");
      return;
    }
    setOtpSentFlag(true);
    triggerNotification('OTP Triggered (ओटीपी भेजा गया)', `Mock Verification Code [1234] generated and sent via SMS to ${phoneInput}`, 'sms');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') {
      const gUid = `user_ot_${Date.now()}`;
      let finalVillageId = signupVillageId;

      if (isAddCustomVillage) {
        if (!customVillageName.trim() || !customVillageState.trim() || !customVillageDistrict.trim()) {
          alert("Please fill all custom village fields (State, District, Village Name) to join.");
          return;
        }

        const newVId = `v_${Date.now()}`;
        const newV: VillageCommunity = {
          id: newVId,
          name: customVillageName.trim(),
          state: customVillageState.trim(),
          district: customVillageDistrict.trim(),
          region: `${customVillageDistrict.trim()} Rural Block`,
          population: Math.floor(Math.random() * 2000) + 1000
        };

        try {
          await saveRecord('villages', newV.id, newV);
          finalVillageId = newVId;
          setBrowseState(customVillageState.trim());
          setBrowseDistrict(customVillageDistrict.trim());
          triggerNotification('New Village Registered', `Village "${customVillageName}" has been successfully added to district hierarchy.`, 'system');
        } catch (err) {
          console.error("Failed to register custom village in Firestore: ", err);
        }
      } else {
        const selectedVInfo = villages.find(v => v.id === signupVillageId);
        if (selectedVInfo) {
          setBrowseState(selectedVInfo.state);
          setBrowseDistrict(selectedVInfo.district);
        }
      }

      const newUser: UserProfile = {
        uid: gUid,
        name: regNameInput.trim() || 'Custom Villager',
        phone: phoneInput,
        role: userRegisterType,
        villageId: finalVillageId,
        isVerified: userRegisterType === 'DM' ? true : false,
        joinedAt: new Date().toISOString()
      };

      try {
        await saveRecord('users', newUser.uid, newUser);
        setCurrentUser(newUser);
        setSelectedVillageId(finalVillageId);
      } catch (err) {
        console.error("Failed to register user profile in Firestore: ", err);
        // Fallback locally
        setAllUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setSelectedVillageId(finalVillageId);
      }

      setOtpSentFlag(false);
      setPhoneInput('');
      setOtpInput('');
      setRegNameInput('');
      setIsAddCustomVillage(false);
      setCustomVillageName('');
      setCustomVillageState('');
      setCustomVillageDistrict('');

      if (userRegisterType === 'DM') {
        triggerNotification('OTP Match Successful', `Honorable DM account activated! Welcome to your District Administration dashboard.`, 'system');
      } else {
        triggerNotification('OTP Match Successful', `You successfully joined this village community! Please wait for District Magistrate verification approval to unlock full features.`, 'system');
      }
      setActiveTab('home');
    } else {
      alert("Invalid mock OTP code. Please use 1234 for sandbox access.");
    }
  };

  // Calculations for displays
  const sortedIncidents = useMemo(() => {
    return [...incidents].sort((a, b) => b.upvotes - a.upvotes);
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return sortedIncidents.filter(inc => {
      const matchesVillage = selectedVillageId === 'all_district' || inc.villageId === selectedVillageId || !inc.villageId;
      const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || inc.category === selectedCategory;
      return matchesVillage && matchesSearch && matchesCategory;
    });
  }, [sortedIncidents, selectedVillageId, searchTerm, selectedCategory]);

  const activeGroupMessages = useMemo(() => {
    return groupMessages.filter(m => {
      const matchesGroup = m.group === activeGroup;
      const matchesVillage = selectedVillageId === 'all_district' || m.villageId === selectedVillageId || !m.villageId;
      return matchesGroup && matchesVillage;
    });
  }, [groupMessages, activeGroup, selectedVillageId]);

  const filteredMarketplace = useMemo(() => {
    return marketplace.filter(m => {
      const matchesCategory = selectedMarketCategory === 'All' || m.category === selectedMarketCategory;
      const matchesVillage = selectedVillageId === 'all_district' || (m as any).villageId === selectedVillageId || !(m as any).villageId;
      return matchesCategory && matchesVillage;
    });
  }, [marketplace, selectedMarketCategory, selectedVillageId]);

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter(b => {
      return selectedVillageId === 'all_district' || b.villageId === selectedVillageId || !b.villageId;
    });
  }, [broadcasts, selectedVillageId]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-stone-900 text-stone-100 theme-dark' : 'bg-[#FAF2EE] text-stone-900 theme-light'} flex flex-col items-center justify-center p-3 md:p-6 font-sans antialiased selection:bg-emerald-800 select-none transition-colors duration-300`}>
      
      {/* Outer framing wrapper redesigned as a beautiful, high-contrast, responsive desktop/tablet dashboard portal */}
      <div className="w-full max-w-4xl bg-stone-950 border border-stone-850 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative h-[840px] md:h-[860px]">
        
        {/* A. SECURE HIGH-CONTRAST HEADER/TIME PANEL */}
        <div className="bg-stone-950 px-6 py-2.5 flex justify-between items-center text-[11px] font-semibold text-stone-400 select-none border-b border-stone-900 shrink-0 relative z-40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-stone-400 text-xs">{currentTimeStr}</span>
            <span className="text-stone-600 font-mono text-[9px] uppercase tracking-wider hidden sm:inline">&bull; Integrated GramSwaraj Portal</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label="Toggle Theme"
              title={lang === 'hi' ? 'थीम बदलें (Toggle Theme)' : 'Toggle Dark/Light Mode'}
              className="flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-850 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer text-[10px] gap-1.5 font-mono uppercase font-black"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="hidden xs:inline">{lang === 'hi' ? 'सफ़ेद' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-505" />
                  <span className="hidden xs:inline">{lang === 'hi' ? 'डार्क' : 'Dark'}</span>
                </>
              )}
            </button>

            <div className="flex items-center bg-stone-900 border border-stone-850 px-2.5 py-1 rounded-lg gap-1.5 relative cursor-pointer hover:border-emerald-850 transition">
              <Languages className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-[11px] text-stone-200 font-bold focus:outline-none cursor-pointer pr-1 border-none outline-none font-sans"
              >
                {LANGUAGES_SUPPORTED.map((l) => (
                  <option key={l.code} value={l.code} className="bg-stone-950 text-stone-100 text-xs">
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* B. INSTANT FLOATING WEBHOOK BANNER NOTIFICATION NOTIFIER (Zapier/Make simulator) */}
        {showingNotifSlider && notifications.length > 0 && (
          <div className="absolute top-11 inset-x-3 bg-stone-900 border-2 border-emerald-800 p-3 rounded-2xl shadow-2xl z-50 animate-fade-in flex flex-col text-xs text-stone-100">
            <div className="flex items-center justify-between font-bold border-b border-stone-800 pb-1 mb-1 text-emerald-400">
              <span className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                {notifications[0].title}
              </span>
              <button 
                onClick={() => setShowingNotifSlider(false)} 
                className="text-stone-400 hover:text-stone-100 text-xs cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-300 italic font-mono bg-stone-950 p-1.5 rounded border border-stone-850">
              {notifications[0].message}
            </p>
            <span className="text-[9px] font-mono text-stone-500 mt-1 self-end">
              ⚡ Webhook Triggered &bull; Active Real-time Hook
            </span>
          </div>
        )}

        {/* C. GRAMSWARAJ PRIMARY BRANDING BLOCK */}
        <header className="bg-stone-950 px-4 py-3 border-b border-stone-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 border border-emerald-800/60 rounded-xl text-emerald-400">
              <Smartphone className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-tight text-stone-100">{t.appName}</h1>
              <p className="text-[9.5px] text-emerald-500/90 font-medium font-sans uppercase tracking-wider">{t.appSubName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 select-none">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] bg-emerald-950/80 border border-emerald-900 text-emerald-400 font-black px-2 py-0.5 rounded-full uppercase">
                  {currentUser.role}: {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    triggerNotification('User Signed Out', 'Session terminated. App locked.', 'system');
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-rose-400 border border-stone-800 rounded-lg text-[9px] font-bold font-mono uppercase cursor-pointer transition"
                >
                  <LogOut className="w-3 h-3 text-rose-500" />
                  <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <span className="text-[9.5px] bg-amber-950/85 border border-amber-920 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase font-mono tracking-wider animate-pulse flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                {lang === 'hi' ? 'सुरक्षित द्वार' : 'Gateway Logged Out'}
              </span>
            )}
          </div>
        </header>

        {/* D. LIVE EMERGENCY ANNOUNCEMENTS FEED BANNER (Gram Pradhan alert) */}
        {broadcasts.length > 0 && activeTab === 'home' && (
          <div className="bg-rose-950/40 border-b border-rose-900 px-3 py-2 shrink-0 flex items-start gap-2 animate-pulse relative overflow-hidden">
            <div className="p-1 bg-rose-900 rounded text-rose-300 mt-0.5 shrink-0 select-none">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1">
                {t.alertFeed} <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block animate-ping" />
              </h5>
              <p className="text-[10.5px] font-sans font-medium text-rose-100 leading-tight block truncate">
                {broadcasts[0].title}: {broadcasts[0].message}
              </p>
            </div>
            <button 
              onClick={() => triggerNotification('आपातकालीन चेतावनी', `${broadcasts[0].title}\n\n${broadcasts[0].message}`, 'sms')}
              className="text-[9px] text-rose-300 font-bold underline shrink-0 hover:text-white"
            >
              {lang === 'hi' ? 'विस्तार' : 'Read'}
            </button>
          </div>
        )}

        {/* E. MOBILE INTERNAL RESPONSIVE WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto bg-stone-900 px-4 py-3 relative sm:scroll-thin">
          
          {!currentUser ? (
            <div className="space-y-4 animate-fade-in font-sans py-2 text-xs">
              
              {/* Auth selection Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-850">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setLoginError('');
                    setOtpSentFlag(false);
                  }}
                  className={`py-2 rounded-lg font-bold text-center transition cursor-pointer text-[10.5px] uppercase tracking-wider ${
                    !isRegisterMode 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-900' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {lang === 'hi' ? 'लॉगइन (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setLoginError('');
                    setOtpSentFlag(false);
                  }}
                  className={`py-2 rounded-lg font-bold text-center transition cursor-pointer text-[10.5px] uppercase tracking-wider ${
                    isRegisterMode 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-900' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {lang === 'hi' ? 'नया खाता (Register)' : 'Register'}
                </button>
              </div>

              {!isRegisterMode ? (
                /* LOGIN SCREEN SCREEN */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h2 className="text-sm font-black text-stone-100 uppercase tracking-wide">
                      {lang === 'hi' ? 'डिजिटल लॉगिन द्वार' : 'Secure Access Gateway'}
                    </h2>
                    <p className="text-[10px] text-stone-400 mt-1 uppercase font-mono tracking-wider">
                      {lang === 'hi' ? 'ग्रामस्वराज एकीकृत पंचायत प्रबंधन' : 'GramSwaraj Integrated Panchayat Administration'}
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-955/40 border border-red-900 text-red-300 rounded-xl font-medium text-[11px] leading-relaxed flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="bg-stone-950 border border-stone-850 rounded-2xl p-4 space-y-3.5">
                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-stone-400 font-bold mb-1 tracking-wider">
                        {lang === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Registered Mobile Number'}
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          placeholder="e.g. +91 94501 23456"
                          className="w-full bg-stone-900 border border-stone-850 pl-9 pr-3 py-2 text-xs rounded-xl text-stone-100 font-mono focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-[#FAF9F6] font-extrabold mb-1 tracking-wider flex justify-between items-center">
                        <span>{lang === 'hi' ? 'पासकोड (PIN)' : 'Security Passcode (PIN)'}</span>
                        <span className="text-[8px] text-stone-500 font-normal normal-case font-sans">
                          {lang === 'hi' ? 'परीक्षण हेतु "1234" दर्ज करें' : 'sandbox pin: 1234'}
                        </span>
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-550 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value)}
                          placeholder="e.g. 1234"
                          maxLength={6}
                          className="w-full bg-stone-900 border border-stone-850 pl-9 pr-3 py-2 text-xs rounded-xl text-stone-100 font-mono tracking-widest focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-extrabold uppercase text-[10.5px] font-mono tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition animate-pulse"
                    >
                      <span>{lang === 'hi' ? 'लॉगइन करें' : 'Login Securely'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </form>

                  {/* SANDBOX ASSESSMENT PANELS */}
                  <div className="bg-stone-950 border border-stone-850 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-mono text-[#FAF9F6] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      {lang === 'hi' ? 'Sandbox त्वरित लॉगिन द्वार' : 'Sandbox Direct Quick Entry (Testing)'}
                    </span>
                    <p className="text-[10px] text-stone-500 leading-normal font-sans">
                      {lang === 'hi' ? 'नीचे दिए गए पूर्व-पंजीकृत खातों पर क्लिक कर विभिन्न प्रशासनिक भूमिकाओं का तुरंत परीक्षण करें:' : 'Choose a role below to auto-login with designated permissions & simulated verification states:'}
                    </p>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          const u = allUsers.find(x => x.uid === 'user_resident_1') || {
                            uid: 'user_resident_1',
                            name: 'Amit Patel',
                            phone: '+91 94501 23456',
                            role: 'Resident' as const,
                            villageId: 'up_baheri',
                            isVerified: true,
                            joinedAt: new Date().toISOString()
                          };
                          setCurrentUser(u);
                          setSelectedVillageId(u.villageId);
                          const vk = villages.find(v => v.id === u.villageId);
                          if (vk) {
                            setBrowseState(vk.state);
                            setBrowseDistrict(vk.district);
                          }
                          triggerNotification('Sandbox Entrance', `Authenticated as Villager: ${u.name}`, 'system');
                        }}
                        className="w-full p-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-850 text-left rounded-xl flex items-center justify-between transition group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[11px] text-[#FAF9F6]">Amit Patel</span>
                            <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-905 text-emerald-405 text-[8.5px] font-mono rounded font-bold uppercase">Resident 🏡</span>
                          </div>
                          <span className="text-[8.5px] text-stone-500 font-mono block mt-0.5">Phone: +91 94501 23456 &bull; Baheri Panchayat</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const u = allUsers.find(x => x.uid === 'user_pradhan_1') || {
                            uid: 'user_pradhan_1',
                            name: 'Pradhan Rajesh Kumar',
                            phone: '+91 98765 43210',
                            role: 'Gram Pradhan' as const,
                            villageId: 'up_baheri',
                            isVerified: true,
                            joinedAt: new Date().toISOString()
                          };
                          setCurrentUser(u);
                          setSelectedVillageId(u.villageId);
                          const vk = villages.find(v => v.id === u.villageId);
                          if (vk) {
                            setBrowseState(vk.state);
                            setBrowseDistrict(vk.district);
                          }
                          triggerNotification('Sandbox Entrance', `Authenticated as Village Head: ${u.name}`, 'system');
                        }}
                        className="w-full p-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-850 text-left rounded-xl flex items-center justify-between transition group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[11px] text-[#FAF9F6]">Pradhan Rajesh Kumar</span>
                            <span className="px-1.5 py-0.2 bg-rose-950 border border-rose-902 text-rose-405 text-[8.5px] font-mono rounded font-bold uppercase">Gram Pradhan 👑</span>
                          </div>
                          <span className="text-[8.5px] text-stone-500 font-mono block mt-0.5">Phone: +91 98765 43210 &bull; Baheri Executive</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-rose-400 transition" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const u = allUsers.find(x => x.role === 'DM') || {
                            uid: 'user_dm_1',
                            name: 'Shri Manoj Kumar (DM Bareilly)',
                            phone: '+91 91122 33445',
                            role: 'DM' as const,
                            villageId: 'up_baheri',
                            isVerified: true,
                            joinedAt: new Date().toISOString()
                          };
                          setCurrentUser(u);
                          setSelectedVillageId('all_district');
                          const vk = villages.find(v => v.id === u.villageId);
                          if (vk) {
                            setBrowseState(vk.state);
                            setBrowseDistrict(vk.district);
                          }
                          triggerNotification('Sandbox Entrance', `Authenticated as Bareilly District Collector`, 'system');
                        }}
                        className="w-full p-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-850 text-left rounded-xl flex items-center justify-between transition group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[11px] text-[#FAF9F6]">Shri Manoj Kumar</span>
                            <span className="px-1.5 py-0.2 bg-amber-950 border border-amber-900 text-amber-355 text-[8.5px] font-mono rounded font-bold uppercase">District DM 🏛️</span>
                          </div>
                          <span className="text-[8.5px] text-stone-500 font-mono block mt-0.5">Phone: +91 91122 33445 &bull; District Bareilly Controller</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* SIGNUP SCREEN REPRESENTATION */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h2 className="text-sm font-black text-stone-100 uppercase tracking-wide">
                      {lang === 'hi' ? 'नागरिक एवं प्रधान पंजीकरण' : 'Communal Directory Registration'}
                    </h2>
                    <p className="text-[10px] text-stone-550 mt-1 uppercase font-mono tracking-wider">
                      {lang === 'hi' ? 'ग्राम पंचायत डिजिटल रजिस्टर से जुड़ें' : 'Join your local gram panchayat central server'}
                    </p>
                  </div>

                  <div className="bg-stone-950 border border-stone-850 rounded-2xl p-4 space-y-3.5">
                    {!otpSentFlag ? (
                      <form onSubmit={handlePhoneSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[9.5px] font-mono uppercase text-stone-450 font-bold mb-1">{lang === 'hi' ? 'पूर्ण नाम' : 'Citizen Full Name'}</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Ram Chander"
                            value={regNameInput}
                            onChange={(e) => setRegNameInput(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl text-[#FAF9F6] focus:outline-none focus:border-emerald-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-mono uppercase text-stone-450 font-bold mb-1">{lang === 'hi' ? '१०-अंकीय फ़ोन नंबर' : '10-Digit Mobile Phone'}</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="+91 94500 00000"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl text-[#FAF9F6] focus:outline-none focus:border-emerald-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] font-mono uppercase text-stone-450 font-bold mb-1">{lang === 'hi' ? 'पदोन्नति / भूमिका' : 'Organization Role / Account Type'}</label>
                          <select
                            value={userRegisterType}
                            onChange={(e: any) => setUserRegisterType(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl text-stone-300"
                          >
                            <option value="Resident">{lang === 'hi' ? 'ग्रामीण सदस्य (Villager Resident)' : 'Resident (Villager)'}</option>
                            <option value="Gram Pradhan">{lang === 'hi' ? 'ग्राम प्रधान (Panchayat Head)' : 'Gram Pradhan (Panchayat Head)'}</option>
                          </select>
                        </div>

                        {/* Hierarchical selectors cascaded */}
                        <div className="bg-stone-900 border border-stone-850 p-3 rounded-xl space-y-2 text-xs">
                          <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                            {lang === 'hi' ? 'ग्राम पंचायत निवास स्थान चुनें' : 'Demographic Location Details'}
                          </span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-550 mb-0.5">{lang === 'hi' ? 'राज्य' : 'State'}</label>
                              <select
                                value={signupState}
                                onChange={(e) => {
                                  const s = e.target.value;
                                  setSignupState(s);
                                  const districts = getDistricts(s);
                                  const firstDist = districts[0] || '';
                                  setSignupDistrict(firstDist);
                                  const villagesList = villages.filter(v => v.state === s && v.district === firstDist);
                                  if (villagesList.length > 0) {
                                    setSignupVillageId(villagesList[0].id);
                                  }
                                }}
                                className="w-full bg-[#111] border border-stone-800 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none"
                              >
                                {statesList.map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-550 mb-0.5">{lang === 'hi' ? 'जिला' : 'District'}</label>
                              <select
                                value={signupDistrict}
                                onChange={(e) => {
                                  const d = e.target.value;
                                  setSignupDistrict(d);
                                  const villagesList = villages.filter(v => v.state === signupState && v.district === d);
                                  if (villagesList.length > 0) {
                                    setSignupVillageId(villagesList[0].id);
                                  }
                                }}
                                className="w-full bg-[#111] border border-stone-800 p-1.5 text-[10px] rounded text-stone-300 focus:outline-[#1c1c1c]"
                              >
                                {signupDistrictsList.map(dt => (
                                  <option key={dt} value={dt}>{dt}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {!isAddCustomVillage ? (
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-555">{lang === 'hi' ? 'ग्राम पंचायत संघ' : 'Gram Panchayat'}</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddCustomVillage(true);
                                    setCustomVillageState(signupState);
                                    setCustomVillageDistrict(signupDistrict);
                                  }}
                                  className="text-[8px] text-emerald-400 hover:text-emerald-300 uppercase font-mono font-bold"
                                >
                                  + {lang === 'hi' ? 'नया गाँव पंजीकृत करें' : 'Add Custom Village'}
                                </button>
                              </div>
                              <select
                                value={signupVillageId}
                                onChange={(e) => setSignupVillageId(e.target.value)}
                                className="w-full bg-[#111] border border-stone-800 p-1.5 text-[10px] rounded text-stone-100 focus:outline-none"
                              >
                                {signupVillagesList.map(vl => (
                                  <option key={vl.id} value={vl.id}>{vl.name}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className="space-y-1.5 border-t border-stone-800/60 pt-2 animate-fade-in">
                              <div className="flex justify-between items-center">
                                <label className="block text-[8px] uppercase font-mono tracking-wider text-emerald-400 font-extrabold">{lang === 'hi' ? 'नया गाँव का नाम' : 'Enter Custom Village Name'}</label>
                                <button
                                  type="button"
                                  onClick={() => setIsAddCustomVillage(false)}
                                  className="text-[8px] text-stone-400 hover:text-stone-205 uppercase font-mono"
                                >
                                  {lang === 'hi' ? 'वापस सूची' : 'Cancel Custom'}
                                </button>
                              </div>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. Ram Nagar Basti"
                                value={customVillageName}
                                onChange={(e) => setCustomVillageName(e.target.value)}
                                className="w-full bg-[#111] border border-[#222] p-1.5 text-[10px] rounded focus:outline-none text-stone-100 placeholder-stone-700"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-bold uppercase text-[10.5px] font-mono tracking-wider cursor-pointer transition active:scale-98"
                        >
                          {lang === 'hi' ? 'ओटीपी कोड प्राप्त करें' : 'Send Verification OTP'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpVerify} className="space-y-4 text-xs animate-fade-in">
                        <p className="text-[10.5px] text-emerald-405 font-bold font-mono text-center bg-stone-900 border border-stone-850 p-2 rounded-lg">
                          {lang === 'hi' ? `[एसएमएस कोड भेजा गया] परीक्षण के लिए कोड 1234 का उपयोग करें` : `SMS Verification Triggered! Enter sandbox code: 1234`}
                        </p>
                        <div>
                          <input 
                            type="text" 
                            required
                            maxLength={4}
                            placeholder="Enter 4-Digit Code"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 p-3 text-center text-sm font-mono tracking-widest rounded-xl focus:outline-none text-stone-100"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs cursor-pointer transition active:scale-98 text-center"
                          >
                            {lang === 'hi' ? 'वेरिफाई करें' : 'Verify & Join✓'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpSentFlag(false)}
                            className="px-4 py-2 bg-[#111] border border-stone-800 rounded-lg text-stone-400 hover:text-white"
                          >
                            {lang === 'hi' ? 'रद्द' : 'Cancel'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* TAB 1: HOME COMPLAINTS PUBLIC FEED PANEL */}
              {activeTab === 'home' && (
            <div className="space-y-4">
              
              {/* Active Portal State & District Hierarchical Filter */}
              <div className="bg-stone-950 border border-stone-850 p-3 rounded-2xl space-y-2.5 font-sans mb-1 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-[10.5px] font-bold text-stone-100 flex flex-wrap items-center gap-1">
                        {lang === 'hi' ? 'सक्रिय पंचायत पोर्टल:' : 'Active Village Portal:'} 
                        <span className="text-emerald-400 font-extrabold bg-stone-900 border border-stone-850 px-1.5 py-0.5 rounded text-[10px]">
                          {selectedVillageId === 'all_district' 
                            ? (lang === 'hi' ? `पूरा जिला (${browseDistrict})` : `All Villages in ${browseDistrict}`)
                            : (villages.find(v => v.id === selectedVillageId)?.name || 'Direct Link')}
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-500 uppercase font-mono tracking-wider">
                        {browseState} &bull; {browseDistrict} {lang === 'hi' ? 'जिला' : 'District'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-stone-400 font-medium font-sans">
                      {lang === 'hi' ? 'त्वरित फ़िल्टर:' : 'Quick Filter:'}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedVillageId('all_district');
                        triggerNotification('Portal Switch', `Switched view to entire Bareilly district. Showing district-wide grievances.`, 'system');
                      }}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-bold border transition ${
                        selectedVillageId === 'all_district'
                          ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {lang === 'hi' ? 'पूरा जिला' : 'Entire District'}
                    </button>
                  </div>
                </div>

                {/* Grid of cascading controls */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 mb-0.5">{lang === 'hi' ? 'राज्य (State)' : 'State'}</label>
                    <select
                      value={browseState}
                      onChange={(e) => {
                        const s = e.target.value;
                        setBrowseState(s);
                        const subD = villages.filter(v => v.state === s).map(v => v.district).filter(Boolean);
                        const firstDist = subD[0] || 'Bareilly';
                        setBrowseDistrict(firstDist);
                        const subV = villages.filter(v => v.state === s && v.district === firstDist);
                        if (subV.length > 0) {
                          setSelectedVillageId(subV[0].id);
                        } else {
                          setSelectedVillageId('all_district');
                        }
                      }}
                      className="w-full bg-stone-900 border border-stone-850 p-1 text-[10px] rounded text-stone-300 focus:outline-none focus:border-emerald-800 font-sans"
                    >
                      {statesList.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 mb-0.5">{lang === 'hi' ? 'जिला (District)' : 'District'}</label>
                    <select
                      value={browseDistrict}
                      onChange={(e) => {
                        const d = e.target.value;
                        setBrowseDistrict(d);
                        const subV = villages.filter(v => v.state === browseState && v.district === d);
                        if (subV.length > 0) {
                          setSelectedVillageId(subV[0].id);
                        } else {
                          setSelectedVillageId('all_district');
                        }
                      }}
                      className="w-full bg-stone-900 border border-stone-850 p-1 text-[10px] rounded text-stone-300 focus:outline-none focus:border-emerald-800 font-sans"
                    >
                      {browseDistrictsList.map(dt => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 mb-0.5">{lang === 'hi' ? 'गांव / पंचायत' : 'Village / Panchayat'}</label>
                    <select
                      value={selectedVillageId}
                      onChange={(e) => {
                        setSelectedVillageId(e.target.value);
                        if (e.target.value !== 'all_district') {
                          const vName = villages.find(v => v.id === e.target.value)?.name;
                          triggerNotification('Portal Switch', `Loading localized ledger for Panchayat: "${vName}".`, 'system');
                        }
                      }}
                      className="w-full bg-stone-900 border border-stone-850 p-1 text-[10px] rounded text-stone-300 focus:outline-none focus:border-emerald-800 font-sans font-medium"
                    >
                      <option value="all_district">{lang === 'hi' ? 'सारे गांव (All)' : 'All Villages'}</option>
                      {browseVillagesList.map(vl => (
                        <option key={vl.id} value={vl.id}>{vl.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Panchayat Alert Feed Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 font-bold flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                  {lang === 'hi' ? 'ग्रामसभा शिकायतें एवं मांग' : 'Gram Sabha Priority Ledger'}
                </span>

                {/* Switch to enable rapid broad alert from Pradhan */}
                {(currentUser?.role === 'Gram Pradhan' || currentUser?.role === 'Admin') && (
                  <button
                    onClick={() => setShowBroadcastForm(!showBroadcastForm)}
                    className="px-2 py-0.5 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-md text-[10px] hover:bg-rose-900 transition flex items-center gap-1 font-semibold cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3 h-3" /> {lang === 'hi' ? 'चेतावनी जारी करें' : 'Post Alert'}
                  </button>
                )}
              </div>

              {/* Administrative Emergency Circular Creator Form */}
              {showBroadcastForm && (
                <form onSubmit={handlePostEmergencyBroadcast} className="p-3 bg-stone-950 border border-rose-950 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-1.5 text-rose-300 uppercase font-bold text-[10px]">
                    <span>{lang === 'hi' ? 'आपातकालीन व्हाट्सएप/एसएमएस ब्रॉडकास्ट' : 'Panchayat Broadcast System'}</span>
                    <button type="button" onClick={() => setShowBroadcastForm(false)} className="text-stone-500 hover:text-stone-300"><X className="w-3 h-3" /></button>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'hi' ? 'आपातकालीन विषय (उदा: ओलावृष्टि की चेतावनी)' : 'Broadcast Title (e.g., Solar Grid Offline)'}
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="w-full bg-stone-900/80 border border-stone-800 p-2 rounded-lg text-[11px] focus:outline-none focus:border-red-800"
                    />
                  </div>
                  <div>
                    <textarea 
                      required
                      rows={2}
                      placeholder={lang === 'hi' ? 'ग्रामीणों के लिए चेतावनी विवरण लिखें...' : 'Type instructions for residents...'}
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      className="w-full bg-stone-900/80 border border-stone-800 p-2 rounded-lg text-[11px] focus:outline-none focus:border-red-800"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <select 
                      value={broadcastSeverity}
                      onChange={(e: any) => setBroadcastSeverity(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded p-1 text-[10px]"
                    >
                      <option value="Immediate">{lang === 'hi' ? 'तत्काल (SMS + Voice)' : 'Immediate (SMS)'}</option>
                      <option value="Important">{lang === 'hi' ? 'महत्वपूर्ण (Alert Banner)' : 'Important'}</option>
                      <option value="General">{lang === 'hi' ? 'सामान्य सूचना' : 'General Circular'}</option>
                    </select>

                    <button 
                      type="submit" 
                      className="px-3.5 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded font-bold text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                    >
                      {lang === 'hi' ? 'ब्रॉडकास्ट शुरू करें' : 'Trigger Broadcast'}
                    </button>
                  </div>
                </form>
              )}

              {/* Feed search filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={lang === 'hi' ? 'गड्ढे, पाइपलाइन, बिजली के खंभे...' : 'Search reported local issues...'}
                    className="w-full bg-stone-950/80 border border-stone-850 rounded-xl p-1.5 pl-9 text-[11px] focus:outline-none focus:border-emerald-800"
                  />
                </div>

                {/* Category filtration badges */}
                <div className="flex gap-1 overflow-x-auto pb-1 select-none text-[10px] font-semibold">
                  {['All', 'Water', 'Power', 'Roads', 'Waste', 'Medical'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full border transition shrink-0 cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-emerald-950 border-emerald-800/80 text-emerald-300 font-bold' 
                          : 'bg-stone-950/50 border-stone-850 text-stone-400 hover:border-stone-800'
                      }`}
                    >
                      {cat === 'All' ? (lang === 'hi' ? 'सभी श्रेणी' : 'All') : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complaints / Grievance list items cards */}
              {filteredIncidents.length === 0 && (
                <div className="bg-stone-950 border border-dashed border-stone-850 rounded-2xl p-6 text-center space-y-3 pb-16 font-sans">
                  <div className="w-10 h-10 bg-stone-900 border border-stone-800 text-stone-400 rounded-full flex items-center justify-center mx-auto border-dashed">
                    <Sparkles className="w-5 h-5 text-emerald-500/80 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      {lang === 'hi' ? 'कोई शिकायत नहीं मिली' : 'No active grievances listed'}
                    </h4>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed mt-1">
                      {lang === 'hi'
                        ? 'इस समय इस खंड/पंचायत में कोई शिकायत दर्ज नहीं है। पूरा जिला चुनें, या पहली समस्या रिपोर्ट करें!'
                        : 'No active reports are registered in index. Choose "Entire District" to browse surrounding panchayats, or submit a new grievance list!'}
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedVillageId('all_district');
                        triggerNotification('Portal Switch', 'Showing Bareilly district ledger overview.', 'system');
                      }}
                      className="px-3 py-1 bg-emerald-950 border border-emerald-950 text-emerald-400 font-bold hover:bg-emerald-900 transition text-[10px] rounded-lg active:scale-95 cursor-pointer font-sans"
                    >
                      {lang === 'hi' ? 'पूरा जिला देखें' : 'Entire District'}
                    </button>
                    <button
                      onClick={() => setActiveTab('report')}
                      className="px-3 py-1 bg-stone-900 border border-stone-850 text-stone-300 font-bold hover:bg-stone-800 transition text-[10px] rounded-lg active:scale-95 cursor-pointer font-sans"
                    >
                      {lang === 'hi' ? 'नया शिकायत पत्र' : 'Submit Grievance'}
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
                {filteredIncidents.map(inc => {
                    const isUpvotedByMe = currentUser ? inc.upvotedBy.includes(currentUser.phone) : false;
                    const isPradhan = currentUser?.role === 'Gram Pradhan' || currentUser?.role === 'Admin';
                    const hasComments = inc.comments && inc.comments.length > 0;

                    return (
                      <div key={inc.id} className="bg-stone-950 border border-stone-850 rounded-2xl p-3.5 space-y-3 transition duration-150 hover:border-stone-750">
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-900/60 text-emerald-400 text-[9px] font-bold rounded-lg uppercase tracking-wide mr-2 inline-block">
                              {inc.category}
                            </span>
                            <span className={`text-[9px] font-mono font-bold ${
                              inc.severity === 'Critical' ? 'text-rose-500 animate-pulse' : 'text-amber-500'
                            }`}>
                              [{inc.severity} Alert]
                            </span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[9.5px] uppercase font-bold font-mono ${
                            inc.status === 'Resolved' ? 'bg-emerald-950/80 border border-emerald-900 text-emerald-400' :
                            inc.status === 'Scheduled' ? 'bg-indigo-950/80 border border-indigo-900 text-indigo-400' : 
                            inc.status === 'Investigating' ? 'bg-amber-950/80 border border-amber-900 text-amber-400' : 'bg-stone-900 text-stone-400'
                          }`}>
                            {inc.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-stone-200 mt-1">{inc.title}</h4>
                          <p className="text-[11px] text-stone-400 leading-relaxed font-sans mt-1">{inc.description}</p>
                        </div>

                        {/* Complaint photo proof attached */}
                        {inc.imageUrl && (
                          <div className="rounded-xl overflow-hidden border border-stone-850 bg-stone-900 relative aspect-[16/9] mt-1.5 opacity-90">
                            <img src={inc.imageUrl} alt="Complaint proof" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        {/* Reporter Tag (Accounting for Anonymous Toggle requirement) */}
                        <div className="flex justify-between items-center text-[10px] text-stone-500 border-t border-stone-900 pt-2 font-mono">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-500" />
                            {inc.isAnonymous ? (
                              <span className="text-stone-400 font-semibold italic flex items-center gap-1">
                                <EyeOff className="w-3 h-3 text-emerald-600/60 shrink-0" />
                                {t.anonymousPlaceholder}
                              </span>
                            ) : (
                              <span className="text-stone-300 font-bold">{inc.reporterName}</span>
                            )}
                          </span>
                          <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Interactive upvotes, comment counter, and Pradhan dashboard triggers */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-stone-900/60 p-2 rounded-xl mt-1.5 border border-stone-850/40">
                          
                          {/* Upvoting widget conforming directly to specifications */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleUpvote(inc.id)}
                              className={`p-1.5 px-3 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer border ${
                                isUpvotedByMe 
                                  ? 'bg-emerald-900/80 border-emerald-800 text-emerald-300 font-black' 
                                  : 'bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${isUpvotedByMe ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                              <span>{t.upvoteBtn} [{inc.upvotes}]</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setActiveCommentId(activeCommentId === inc.id ? null : inc.id)}
                              className="px-2.5 py-1.5 bg-stone-950 border border-stone-850 text-stone-400 hover:text-stone-200 rounded-lg text-[10.5px] font-medium flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                              <span>{t.commentsTitle} ({inc.comments?.length || 0})</span>
                            </button>

                            {/* Pradhan triage panel triggers */}
                            {isPradhan && (
                              <button
                                onClick={() => {
                                  setSelectedIncidentForUpdate(inc);
                                  setUpdatedStatus(inc.status);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-lg text-[10.5px] font-bold uppercase tracking-wide flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                {t.changeStatus}
                              </button>
                            )}
                          </div>

                        </div>

                        {/* Interactive timeline logging (Resolving records) */}
                        {inc.progressUpdates && inc.progressUpdates.length > 0 && (
                          <div className="bg-stone-900/40 border border-dashed border-stone-850 rounded-xl p-2.5 space-y-1.5 text-[10.5px]">
                            <div className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wide text-[9px] font-mono">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{lang === 'hi' ? 'प्रधान प्रगति रिपोर्ट' : 'Panchayat Dispatch updates'}</span>
                            </div>
                            {inc.progressUpdates.map(u => (
                              <div key={u.id} className="border-l border-stone-800 pl-2 ml-1 leading-snug">
                                <span className="font-bold text-stone-300">{u.updaterName} ({u.status}): </span>
                                <span className="text-stone-400">{u.notes}</span>
                                <span className="block text-[8px] text-stone-600 font-mono mt-0.5">{new Date(u.timestamp).toLocaleTimeString()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Collapsed dialogue comments loop */}
                        {activeCommentId === inc.id && (
                          <div className="mt-2.5 pt-2.5 border-t border-stone-900 space-y-2 animate-fade-in">
                            <div className="max-h-24 overflow-y-auto space-y-1.5 text-[11px] pr-1 scroll-thin">
                              {!inc.comments || inc.comments.length === 0 ? (
                                <p className="text-stone-500 italic text-center py-1.5">{t.noComments}</p>
                              ) : (
                                inc.comments.map(c => (
                                  <div key={c.id} className="bg-stone-900 border border-stone-850 p-2 rounded-xl text-[11px] space-y-0.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono text-stone-500 uppercase">
                                      <span className="font-bold text-stone-300">{c.authorName} ({c.authorRole})</span>
                                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-stone-400 font-sans leading-snug">{c.message}</p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Comment creation form */}
                            {currentUser ? (
                              <form onSubmit={(e) => handleAddComment(e, inc.id)} className="flex gap-1.5 pt-1">
                                <input
                                  type="text"
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder={t.writeOpinion}
                                  required
                                  className="flex-1 bg-stone-950 border border-stone-800 rounded-lg p-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-800"
                                />
                                <button type="submit" className="p-1 px-3 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded-lg hover:bg-emerald-900 transition flex items-center justify-center cursor-pointer active:scale-95">
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            ) : (
                              <p className="text-center text-[9.5px] italic text-rose-400 pt-1 border-t border-stone-900/60">{t.notifFirst}</p>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* TAB 2: CIVIC COMPLAINT SUBMISSION DOCK */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-stone-400">{lang === 'hi' ? 'शिकायती पोर्टल' : 'Civic Redressal Portal'}</h3>
                  <h2 className="text-sm font-black text-stone-100">{lang === 'hi' ? 'ग्राम पंचायत की सहायता हेतु' : 'Report Village Blight/Issue'}</h2>
                </div>
                <Users className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>

              {!currentUser ? (
                <div className="p-5 text-center bg-stone-950 border border-stone-850 rounded-2xl space-y-3">
                  <div className="w-10 h-10 bg-rose-950/50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    {lang === 'hi' ? 'शिकायत दर्ज़ करने के लिए कृपया प्रोफाइल सेक्शन में अपने फ़ोन नंबर से ओटीपी लॉगिन करें।' : 'Account verification is required to submit. Please log in with Phone/OTP first.'}
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="font-bold py-1.5 px-4 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-900 transition text-[11px] rounded-lg cursor-pointer"
                  >
                    {lang === 'hi' ? 'लॉगिन करें' : 'Proceed to Login'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportGrievance} className="space-y-3.5 pb-20 text-xs">
                  
                  {/* Complaint Coordinates pinpointing widget details */}
                  <div className="p-3 bg-stone-950 border border-stone-850 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="block text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-bounce" />
                        {lang === 'hi' ? 'स्थान निर्देशांक सेट करें' : 'Pinpoint Issue Coordinates'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono font-bold bg-stone-900 px-1.5 py-0.2 rounded border border-stone-850">
                        {pinX}% H, {pinY}% V
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-stone-100 italic">
                      {lang === 'hi' ? 'नीचे दिए गए वर्गाकार नक्शे पर टैप कर समस्या की जगह चुने:' : 'Tap anywhere on the virtual quadrant grid to lock latitude marker:'}
                    </p>

                    {/* Miniature interactive grid quadrant mapping */}
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        setPinX(x);
                        setPinY(y);
                      }}
                      className="aspect-[16/9] w-full bg-stone-900 rounded-xl border border-stone-800 relative cursor-crosshair overflow-hidden hover:opacity-95 text-stone-500 font-mono text-[9px] flex items-center justify-center"
                    >
                      {/* Grid design lines */}
                      <div className="absolute inset-x-0 h-0.5 bg-stone-950/40 border-b border-stone-850/60 top-1/2" />
                      <div className="absolute inset-y-0 w-0.5 bg-stone-950/40 border-r border-stone-850/60 left-1/2" />
                      
                      <div className="absolute flex flex-col items-center justify-center p-2 text-center pointer-events-none select-none">
                        <span className="text-stone-600 block">[Primary School Complex]</span>
                        <span className="text-[8px] text-stone-700 block select-none">Panchayat Feeder Area</span>
                      </div>

                      {/* Floating pin indicator representing selector point */}
                      <div 
                        className="absolute h-6 w-6 -ml-3 -mt-6 pointer-events-none transition-all duration-300"
                        style={{ left: `${pinX}%`, top: `${pinY}%` }}
                      >
                        <MapPin className="w-6 h-6 text-emerald-500 fill-emerald-950 animate-bounce" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-950 border border-stone-850 p-3 rounded-2xl space-y-1">
                    <label className="block text-[9px] font-mono uppercase text-[#10b981] font-bold mb-1">
                      {lang === 'hi' ? 'लक्षित ग्राम पंचायत (Gram Panchayat)' : 'Target Gram Panchayat'}
                    </label>
                    <select
                      value={selectedVillageId === 'all_district' ? (currentUser?.villageId || 'up_baheri') : selectedVillageId}
                      onChange={(e) => {
                        setSelectedVillageId(e.target.value);
                      }}
                      className="w-full bg-stone-900 border border-stone-800 p-2 text-xs rounded-xl focus:outline-none focus:border-emerald-800 text-stone-300 font-medium cursor-pointer"
                    >
                      {villages.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.district}, {v.state})
                        </option>
                      ))}
                    </select>
                    <p className="text-[8px] text-stone-500 font-medium">
                      {lang === 'hi' ? 'आपकी शिकायत सीधे इस चयनित पंचायत के प्रधान एवं जिला प्रशासन तक पहुँच जाएगी।' : 'Your report will be lodged directly in this active Panchayat ledger.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'समस्या का नाम (विषय)' : 'Short Title (English/Hindi)'}</label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'hi' ? 'उदा: पानी के पाइप में रिसाव, स्ट्रीटलाइट खराब है' : 'Brief problem summary (e.g. Handpump leak)'}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'शिकायती ब्यौरा (विवरण)' : 'Detailed Description'}</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={lang === 'hi' ? 'समस्या के बारे में विस्तार से लिखे ताकि प्रधान उचित कार्यवाही कर सकें...' : 'Provide specific milestones, locations or safety alerts for repairs...'}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'शिकायत श्रेणी' : 'Infras Category'}</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as IncidentCategory)}
                        className="w-full bg-stone-950 border border-stone-800 p-2 text-xs rounded-xl focus:outline-none focus:border-emerald-800 text-stone-300"
                      >
                        <option value="Water">{lang === 'hi' ? 'पेयजल (Water)' : 'Water'}</option>
                        <option value="Power">{lang === 'hi' ? 'बिजली (Power)' : 'Power'}</option>
                        <option value="Roads">{lang === 'hi' ? 'सड़क / मार्ग (Roads)' : 'Roads'}</option>
                        <option value="Waste">{lang === 'hi' ? 'कचरा / नाली (Waste)' : 'Waste'}</option>
                        <option value="Medical">{lang === 'hi' ? 'स्वास्थ्य (Medical)' : 'Medical'}</option>
                        <option value="General">{lang === 'hi' ? 'अन्य सामान्य (General)' : 'General'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'अति-आवश्यकता स्तर' : 'Urgency Severity'}</label>
                      <select
                        value={newSeverity}
                        onChange={(e) => setNewSeverity(e.target.value as Severity)}
                        className="w-full bg-stone-950 border border-stone-800 p-2 text-xs rounded-xl focus:outline-none focus:border-emerald-800 text-stone-300"
                      >
                        <option value="Low">{lang === 'hi' ? 'निम्न (Low)' : 'Low'}</option>
                        <option value="Medium">{lang === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</option>
                        <option value="High">{lang === 'hi' ? 'उच्च (High)' : 'High'}</option>
                        <option value="Critical">{lang === 'hi' ? 'गंभीर आपातकाल (Critical)' : 'Critical'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo addition widget simulator */}
                  <div className="p-3 bg-stone-950 border border-stone-850 rounded-2xl space-y-2">
                    <span className="block text-[9px] font-mono text-stone-400 font-bold">{lang === 'hi' ? 'फ़ोटो प्रमाण संलग्न करें' : 'Attach Photo Evidence'}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickAttachMockPic(newCategory)}
                        className="flex-1 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-[10.5px] font-bold text-emerald-400 transition cursor-pointer"
                      >
                        {lang === 'hi' ? 'फोटोग्राफ सिमुलेटर' : 'Attach Mock Farm Photo'}
                      </button>
                      {newImage && (
                        <button
                          type="button"
                          onClick={() => setNewImage('')}
                          className="px-3 bg-rose-950 hover:bg-rose-900 border border-rose-900 rounded-lg text-[10.5px] font-bold text-rose-300 transition cursor-pointer"
                        >
                          {lang === 'hi' ? 'हटाएं' : 'Remove'}
                        </button>
                      )}
                    </div>
                    {newImage && (
                      <div className="rounded-xl overflow-hidden tracking-normal aspect-[16/10] bg-stone-900 border border-stone-850 max-w-[120px]">
                        <img src={newImage} alt="Simulated incident preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Anonymous reporting toggle (Core specification logic) */}
                  <div className="bg-stone-950 border border-stone-850 p-3 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anon-check"
                        checked={reportAnonymously}
                        onChange={(e) => setReportAnonymously(e.target.checked)}
                        className="w-4 h-4 text-emerald-500 bg-stone-900 border-stone-800 rounded focus:ring-emerald-700 focus:ring-2 focus:ring-offset-bg cursor-pointer"
                      />
                      <label htmlFor="anon-check" className="text-stone-300 select-none cursor-pointer font-bold text-[11px]">
                        {t.postAnonymously} (अनाम रूप से शिकायत करें)
                      </label>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-snug pl-6 font-medium">
                      {t.anonymousHint}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition cursor-pointer active:scale-97"
                  >
                    {lang === 'hi' ? 'दर्ज करें और ग्राम पंचायत को भेजें' : 'Registered Complaints Webhook'}
                  </button>
                </form>
              )}

            </div>
          )}

          {/* TAB 3: CLASSIFIEDS / MANDI BOARD MARKETPLACE COMPONENT */}
          {activeTab === 'market' && (
            <div className="space-y-4">
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center bg-stone-950/40 p-2 rounded-xl">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-stone-400">{lang === 'hi' ? 'मंडी वर्गीकृत विज्ञापन' : 'Rural Classified directory'}</h3>
                  <h2 className="text-sm font-black text-stone-100">{lang === 'hi' ? 'कल्याणकारी मंडी बोर्ड' : 'Local Mandi classifieds'}</h2>
                </div>
                
                {currentUser ? (
                  <button
                    onClick={() => setShowAddListing(!showAddListing)}
                    className="px-2.5 py-1 bg-emerald-950 border border-emerald-900 hover:bg-emerald-900 text-emerald-400 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    {showAddListing ? <X className="w-3.0 h-3.0" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{t.addListing}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-stone-500 font-bold italic">{lang === 'hi' ? 'लॉगिन करें' : 'Login info'}</span>
                )}
              </div>

              {/* Classified creator form displayed only to logged-in */}
              {showAddListing && currentUser && (
                <form onSubmit={handleAddMarketplaceListing} className="p-3 bg-stone-950 border border-stone-850 rounded-2xl space-y-2.5 text-xs animate-fade-in">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-1.5 text-[10.5px] font-black text-stone-200">
                    <span>{lang === 'hi' ? 'मंडी विज्ञापन प्रपत्र दर्ज' : 'Add Marketplace Classified ad'}</span>
                    <button type="button" onClick={() => setShowAddListing(false)} className="text-stone-500 hover:text-stone-300"><X className="w-3.5 h-3.5" /></button>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-stone-500 mb-0.5">{lang === 'hi' ? 'शीर्षक' : 'Ad Title'}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'hi' ? 'उदा: खाद के खाली बोरे, भैंस बिकाऊ है' : 'e.g. Combine harvester service'}
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 p-2 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-stone-500 mb-0.5">{lang === 'hi' ? 'कीमत / दर' : 'Price / Demand'}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'hi' ? 'उदा: ₹450 / कुंतल, ₹350 / दिन' : 'e.g. ₹500/day or ₹1,200/bag'}
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 p-2 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 mb-0.5">{lang === 'hi' ? 'मंडी वर्ग' : 'Product Class'}</label>
                      <select
                        value={listCategory}
                        onChange={(e: any) => setListCategory(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 p-1.5 rounded-lg text-[11px]"
                      >
                        <option value="Goods">{lang === 'hi' ? 'कृषि उपज (Goods)' : 'Goods / Produce'}</option>
                        <option value="Services">{lang === 'hi' ? 'पंप/ट्रैक्टर सेवाएं (Services)' : 'Services / Tools'}</option>
                        <option value="Jobs">{lang === 'hi' ? 'मजदूरी नौकरियां (Jobs)' : 'Jobs / Livelihood'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 mb-0.5">{lang === 'hi' ? 'विषय छवि चित्र' : 'Subject Picture'}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setListImage('https://images.unsplash.com/photo-1574325131876-a799ed791500?auto=format&fit=crop&q=80&w=600');
                        }}
                        className="w-full bg-stone-900 hover:bg-stone-850 border border-stone-800 p-1.5 rounded-lg text-[10.5px] font-bold text-stone-300"
                      >
                        {listImage ? 'Image Loaded ✓' : 'Use Mock Agro Pic'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-stone-500 mb-0.5">{lang === 'hi' ? 'विज्ञापन विवरण' : 'Detailed context details'}</label>
                    <textarea 
                      required
                      placeholder={lang === 'hi' ? 'संपर्क जानकारी और सामान के बारे में विस्तार से लिखे...' : 'Explain condition, delivery support, exact coordinates...'}
                      rows={2}
                      value={listDesc}
                      onChange={(e) => setListDesc(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 p-2 rounded-lg text-xs font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-black uppercase tracking-wider text-xs cursor-pointer"
                  >
                    {lang === 'hi' ? 'विज्ञापन प्रकाशित करें (मंडी बोर्ड)' : 'Save classified Entry'}
                  </button>
                </form>
              )}

              {/* Marketplace Category toggler Filter buttons */}
              <div className="flex gap-1 overflow-x-auto text-[10px] font-bold select-none py-1">
                {['All', 'Goods', 'Services', 'Jobs'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedMarketCategory(cat)}
                    className={`px-3 py-1 rounded-full border transition shrink-0 cursor-pointer ${
                      selectedMarketCategory === cat 
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-300 font-black' 
                        : 'bg-stone-950/50 border-stone-850 text-stone-400 hover:border-stone-800'
                    }`}
                  >
                    {cat === 'All' ? (lang === 'hi' ? 'सभी' : 'All') : (
                      cat === 'Goods' ? t.marketGoods : (cat === 'Services' ? t.marketServices : t.marketJobs)
                    )}
                  </button>
                ))}
              </div>

              {/* Marketplace listing list cards */}
              {filteredMarketplace.length === 0 && (
                <div className="bg-stone-950 border border-stone-850 rounded-2xl p-6 text-[11px] text-center text-stone-500 font-sans w-full col-span-2">
                  {lang === 'hi'
                    ? 'इस समय इस श्रेणी या चयनित पंचायत पोर्टल में कोई विज्ञापन उपलब्ध नहीं हैं।'
                    : 'No classified listings or ads are registered in this selected village portal.'}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                {filteredMarketplace.map(m => (
                    <div key={m.id} className="bg-stone-950 border border-stone-850 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-lg hover:border-stone-750 transition">
                      {m.imageUrl && (
                        <div className="w-full sm:w-28 h-28 bg-stone-900 border-b sm:border-b-0 sm:border-r border-stone-900 shrink-0 relative aspect-[16/10] sm:aspect-square">
                          <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}

                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="px-1.5 py-0.2 bg-stone-900 border border-stone-800 text-stone-400 font-mono text-[8.5px] uppercase rounded">
                              {m.category === 'Goods' ? t.marketGoods : (m.category === 'Services' ? t.marketServices : t.marketJobs)}
                            </span>
                            <span className="font-mono text-[10.5px] text-emerald-400 font-black bg-emerald-950 border border-emerald-900/60 px-1.5 py-0.2 rounded">
                              {m.price}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-[#FAF9F6] text-[11.5px] mt-1.5 leading-snug">{m.title}</h4>
                          <p className="text-[10.5px] text-stone-400 line-clamp-3 leading-relaxed font-sans mt-1">{m.description}</p>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-stone-900/60 font-mono text-[10px] text-stone-500">
                          <div>
                            <span className="font-bold text-stone-300 block leading-tight">{m.contactName}</span>
                            <span className="block text-[8.5px] text-stone-500 mt-0.5">{m.contactPhone}</span>
                          </div>

                          {currentUser ? (
                            <a 
                              href={`sms:${m.contactPhone}?body=Hello ${m.contactName}, I saw your classified listing "${m.title}" on GramSwaraj Mandi. Is it still available?`}
                              className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition active:scale-95 text-[9.5px]"
                              onClick={() => triggerNotification('Automated SMS redirect', `Opening SMS gateway to connect with seller ${m.contactName}`, 'sms')}
                            >
                              {lang === 'hi' ? 'संपर्क करें' : 'Send SMS'}
                            </a>
                          ) : (
                            <span className="text-[9px] italic text-rose-400 text-right max-w-[100px]">
                              {lang === 'hi' ? 'संपर्क हेतु लॉगिन करे' : 'Login to view'}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* TAB 4: COMMUNITIES SUBGROUP DISCUSSIONS (Specific farmer/youth/women groups) */}
          {activeTab === 'groups' && (
            <div className="space-y-4 flex flex-col h-full pb-20">
              
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-stone-400">{lang === 'hi' ? 'विशेष ग्राम चौपाल' : 'Direct Special Forums'}</h3>
                  <h2 className="text-sm font-black text-stone-100">{lang === 'hi' ? 'ग्राम सभा समूह चर्चा' : 'Village Group Dialogue'}</h2>
                </div>
                <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>

              {/* Group category selectors */}
              <div className="grid grid-cols-3 gap-1 shrink-0 text-center font-bold text-[10px]">
                {(['Farmers', 'Youth', 'Women'] as SubgroupType[]).map(gp => {
                  const isActive = activeGroup === gp;
                  const label = gp === 'Farmers' ? (lang === 'hi' ? '🌾 किसान मंच' : '🌾 Farmers') : 
                                (gp === 'Youth' ? (lang === 'hi' ? '🤝 युवा क्लब' : '🤝 Youth') : (lang === 'hi' ? '👩 महिला स्वयंसहायता' : '👩 Women SHG'));

                  return (
                    <button
                      key={gp}
                      onClick={() => setActiveGroup(gp)}
                      className={`py-1.5 rounded-lg border transition font-black truncate cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-950 border-emerald-800 text-emerald-300' 
                          : 'bg-stone-950/40 border-stone-850 text-stone-400 hover:border-stone-800 hover:text-stone-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Active group comments thread display */}
              <div className="flex-1 bg-stone-950 border border-stone-850 rounded-2xl p-3 flex flex-col h-[340px] overflow-hidden">
                
                {/* Scrollable feed messages */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans scroll-thin">
                  {activeGroupMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-stone-500 italic text-xs text-center p-4">
                      {lang === 'hi' ? 'इस समूह में कोई चर्चा नहीं हुई है। पहले टिप्पणी लिखकर शुरुआत करें!' : 'Begin the dialogue in this secure space.'}
                    </div>
                  ) : (
                    activeGroupMessages.map(m => (
                      <div key={m.id} className="bg-stone-900 border border-stone-850 p-2 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-stone-500 uppercase">
                          <span className="font-bold text-stone-300 flex items-center gap-1">
                            {m.isAnonymous ? (
                              <span className="text-stone-400 italic flex items-center gap-1">
                                <EyeOff className="w-2.5 h-2.5 text-emerald-500/50" />
                                {t.anonymousPlaceholder}
                              </span>
                            ) : (
                              m.senderName
                            )}
                          </span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-stone-400 font-medium leading-relaxed">{m.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Sender form */}
                {currentUser ? (
                  <form onSubmit={handleSendGroupMessage} className="pt-2.5 border-t border-stone-900 mt-2 space-y-2">
                    
                    {/* Anonymous switch matching verified but hiding profile requirement */}
                    <div className="flex items-center justify-between text-[10px] text-stone-500 pb-1">
                      <div className="flex items-center gap-1.5 select-none">
                        <input
                          type="checkbox"
                          id="msg-anon"
                          checked={messageAnonymous}
                          onChange={(e) => setMessageAnonymous(e.target.checked)}
                          className="w-3.5 h-3.5 bg-stone-900 border-stone-800 text-emerald-500 rounded focus:ring-emerald-700 focus:ring-offset-0 cursor-pointer"
                        />
                        <label htmlFor="msg-anon" className="cursor-pointer select-none">
                          {lang === 'hi' ? 'अनाम रूप से पोस्ट करें (Hide Name)' : 'Anonymous mode'}
                        </label>
                      </div>
                      <span className="text-stone-600 font-mono text-[8px] uppercase">Bareilly Secure SSL</span>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={`${lang === 'hi' ? 'चौपाल पर संदेश लिखें...' : 'Type message to group...'}`}
                        required
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-lg p-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-800"
                      />
                      <button type="submit" className="p-1 px-3 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-lg hover:bg-emerald-900 transition flex items-center justify-center cursor-pointer active:scale-95">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-center text-[10px] italic text-rose-400 pt-2 border-t border-stone-900">
                    {lang === 'hi' ? 'संदेह और चर्चा में शामिल होने के लिए फोन लॉगिन अनिवार्य है।' : 'OTP authentication is required to send messages.'}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* TAB 5: SECURE USER GATEWAY / DEMO ACCOUNT PERSITCH PAD */}
          {activeTab === 'profile' && (
            <div className="space-y-4 pb-16 text-xs">

              {/* DISTRICT MAGISTRATE (DM) ADMIN PORTAL */}
              {currentUser?.role === 'DM' && (
                <div className="bg-stone-950 border border-amber-500/30 rounded-2xl p-4 space-y-4 font-sans shadow-xl relative overflow-hidden">
                  {/* Decorative golden ambient seal decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 text-amber-500" />
                      <div>
                        <h3 className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-extrabold">Executive Command</h3>
                        <h2 className="text-xs font-black text-stone-100">{lang === 'hi' ? 'जिलाधिकारी प्रशासनिक नियंत्रण केंद्र' : 'District Magistrate Control Center'}</h2>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-950 border border-amber-900/60 text-amber-300 rounded font-mono text-[9px] font-bold">
                      OFFICER IS ACTIVE
                    </span>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                    <div className="bg-stone-900/50 border border-stone-850 p-2 rounded-xl">
                      <span className="text-stone-500 block text-[8px] uppercase tracking-wider">{lang === 'hi' ? 'कुल ग्राम पंचायत' : 'Total Villages'}</span>
                      <span className="text-stone-200 text-xs font-black block mt-0.5">{villages.length}</span>
                    </div>
                    <div className="bg-stone-900/50 border border-stone-850 p-2 rounded-xl">
                      <span className="text-stone-500 block text-[8px] uppercase tracking-wider">{lang === 'hi' ? 'कुल सदस्य' : 'Total Members'}</span>
                      <span className="text-stone-200 text-xs font-black block mt-0.5">{allUsers.length}</span>
                    </div>
                    <div className="bg-stone-900/55 border border-stone-850 p-2 rounded-xl">
                      <span className="text-stone-500 block text-[8px] uppercase tracking-wider">{lang === 'hi' ? 'लंबित सत्यापन' : 'Pending Verification'}</span>
                      <span className="text-amber-400 text-xs font-black block mt-0.5 animate-pulse">
                        {allUsers.filter(u => !u.isVerified).length}
                      </span>
                    </div>
                  </div>

                  {/* Interactive form to add custom Village */}
                  <div className="bg-stone-900/40 border border-stone-850/60 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono uppercase font-bold text-stone-400 block tracking-wider">
                      {lang === 'hi' ? 'नया ग्राम पंचायत शामिल करें' : 'Register New Active Gram Panchayat'}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <select
                          value={dmNewState}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDmNewState(val);
                            const dists = getDistricts(val);
                            setDmNewDistrict(dists[0] || 'Bareilly');
                          }}
                          className="w-full bg-stone-950 border border-stone-800 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none focus:border-amber-850"
                        >
                          {statesList.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={dmNewDistrict}
                          onChange={(e) => setDmNewDistrict(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none focus:border-amber-850"
                        >
                          {getDistricts(dmNewState).map(dt => (
                            <option key={dt} value={dt}>{dt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Village Name"
                          value={dmNewVillageName}
                          onChange={(e) => setDmNewVillageName(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none focus:border-amber-800"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!dmNewVillageName.trim() || !dmNewState.trim() || !dmNewDistrict.trim()) {
                          triggerNotification('Configuration Error', 'Please complete State, District, and Village input parameters.', 'system');
                          return;
                        }
                        const exists = villages.some(v => v.name.toLowerCase() === dmNewVillageName.trim().toLowerCase());
                        if (exists) {
                          triggerNotification('Duplicate Registration', `Village "${dmNewVillageName}" is already listed inside community repository.`, 'system');
                          return;
                        }
                        const newV: VillageCommunity = {
                          id: `v_${Date.now()}`,
                          name: dmNewVillageName.trim(),
                          state: dmNewState.trim(),
                          district: dmNewDistrict.trim(),
                          region: `${dmNewDistrict.trim()} Block Admin`,
                          population: Math.floor(Math.random() * 2500) + 1500
                        };
                        const updated = [...villages, newV];
                        setVillages(updated);
                        localStorage.setItem('grams_villages', JSON.stringify(updated));
                        setDmNewVillageName('');
                        triggerNotification('Executive Action Successful', `Panchayat Community Center for "${newV.name}" created under ${newV.district} district.`, 'system');
                      }}
                      className="w-full py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-850 text-amber-300 font-bold uppercase text-[9.5px] rounded-lg tracking-wider transition active:scale-95 cursor-pointer"
                    >
                      {lang === 'hi' ? 'नया ग्राम पंचायत जोड़ें' : 'Deploy Village Communal Core ✓'}
                    </button>
                  </div>

                  {/* Pending Citizen verification validation console queue */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase font-bold text-stone-400 block tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-500" />
                      {lang === 'hi' ? 'लंबित नागरिक एवं प्रधान सत्यापन' : 'Citizen Credentials Validation Queue'}
                    </span>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 scroll-thin">
                      {allUsers.filter(u => !u.isVerified).length === 0 ? (
                        <p className="text-center py-4 bg-stone-900/20 border border-stone-850 rounded-xl text-stone-500 italic text-[10px]">
                          {lang === 'hi' ? 'सत्यापन के लिए कोई लंबित सदस्य नहीं हैं।' : 'All registered residents have been authorized and validated.'}
                        </p>
                      ) : (
                        allUsers.filter(u => !u.isVerified).map(u => (
                          <div key={u.uid} className="bg-stone-900/50 border border-stone-850 p-2 text-[10px] rounded-xl flex items-center justify-between gap-1">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-[#FAF9F6]">
                                <span>{u.name}</span>
                                <span className="px-1 py-0.2 bg-stone-800 text-amber-400 border border-stone-750 text-[8px] uppercase font-mono rounded">
                                  {u.role === 'Gram Pradhan' ? 'Gram Pradhan 👑' : 'Resident 🏡'}
                                </span>
                              </div>
                              <div className="text-[8.5px] text-stone-500 font-mono mt-0.5 uppercase">
                                {u.phone} &bull; Panchayat: {villages.find(v => v.id === u.villageId)?.name || 'Direct Link'}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const updated = allUsers.map(x => {
                                  if (x.uid === u.uid) {
                                    return { ...x, isVerified: true };
                                  }
                                  return x;
                                });
                                setAllUsers(updated);
                                localStorage.setItem('grams_users', JSON.stringify(updated));
                                triggerNotification(
                                  'Resident Approved ✓',
                                  `Officer approved credentials for Amit Patel/resident "${u.name}". Access permissions expanded.`,
                                  'sms'
                                );
                              }}
                              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/80 text-emerald-300 font-bold hover:text-emerald-200 text-[9px] rounded-lg cursor-pointer transition active:scale-95"
                            >
                              {lang === 'hi' ? 'सत्यापित' : 'Approve'}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Registered Village Master Records Directory list */}
                  <div className="border-t border-stone-850 pt-2.5 space-y-1.5">
                    <span className="text-[9px] font-mono uppercase font-bold text-stone-400 block tracking-wider">
                      {lang === 'hi' ? 'राजकोषीय ग्राम पंचायत सूची' : 'Registered Village Master Directory'}
                    </span>
                    <div className="max-h-24 overflow-y-auto grid grid-cols-2 gap-1 pr-1 scroll-thin text-[9px] font-sans">
                      {villages.map(v => (
                        <div key={v.id} className="bg-stone-900/30 border border-stone-850 p-1.5 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-[#FAF9F6] block text-[9.5px]">{v.name}</span>
                            <span className="text-[8px] font-mono uppercase text-stone-500 block leading-none">{v.district}, {v.state}</span>
                          </div>
                          <span className="text-[8px] text-emerald-500 font-bold font-mono">
                            {allUsers.filter(u => u.villageId === v.id).length} citizens
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-b border-stone-850 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-stone-400">{lang === 'hi' ? 'सुरक्षित पंजीकरण गेटवे' : 'OTP Credentials Gate'}</h3>
                  <h2 className="text-sm font-black text-stone-100">{t.phoneLogin}</h2>
                </div>
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>

              {/* Demo switch controls allowing assessor full discoverability */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-3.5 space-y-3.5">
                <span className="block text-[9.5px] uppercase font-mono tracking-widest text-[#FAF9F6] font-extrabold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {lang === 'hi' ? 'सरल परीक्षण उपकरण (Switch Personas)' : 'Assessor Sandbox Switch Pane'}
                </span>
                <p className="text-[10.5px] text-stone-400 leading-relaxed font-sans">
                  {lang === 'hi' ? 'विभिन्न भूमिकाओं (ग्रामीण, ग्राम प्रधान या जिला प्रशासक) के बीच बदलाव कर सुरक्षा नियमों और एसएमएस वर्कफ़्लो का परीक्षण करें।' : 'Instantly swap roles to verify restricted status modifications or alerts workflows:'}
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => switchPersona('Resident')}
                    className={`p-2.5 rounded-xl border font-bold text-left flex items-center justify-between transition cursor-pointer ${
                      currentUser?.role === 'Resident' 
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-300' 
                        : 'bg-stone-900 border-stone-850 text-stone-400 hover:bg-stone-850 hover:text-stone-300'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-[11px]">{lang === 'hi' ? 'अमित पटेल (ग्रामीण)' : 'Amit Patel (Villager)'}</span>
                      <span className="text-[9px] font-mono text-stone-500 block font-normal mt-0.5">{lang === 'hi' ? 'शिकायत कर सकते हैं, मंडी विज्ञापन और उपवोट' : 'Can submit and upvote complaints, post classified ads'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => switchPersona('Gram Pradhan')}
                    className={`p-2.5 rounded-xl border font-bold text-left flex items-center justify-between transition cursor-pointer ${
                      currentUser?.role === 'Gram Pradhan' 
                        ? 'bg-rose-950 border-rose-900 text-rose-300 animate-pulse' 
                        : 'bg-stone-900 border-stone-850 text-stone-400 hover:bg-stone-850 hover:text-stone-300'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-[11px]">{lang === 'hi' ? 'राजेश कुमार (ग्राम प्रधान)' : 'Pradhan Rajesh Kumar (Village Head)'}</span>
                      <span className="text-[9px] font-mono text-stone-500 block font-normal mt-0.5">{lang === 'hi' ? 'शिकायतों की स्थिति बदल सकते हैं, आपात चेतावनी' : 'Status triage, dispatch alerts & emergency broadcasts'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => switchPersona('DM')}
                    className={`p-2.5 rounded-xl border font-bold text-left flex items-center justify-between transition cursor-pointer ${
                      currentUser?.role === 'DM' 
                        ? 'bg-amber-950 border-amber-900 text-amber-300 animate-pulse' 
                        : 'bg-stone-900 border-stone-850 text-stone-400 hover:bg-stone-850 hover:text-stone-300'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-[11px]">{lang === 'hi' ? 'श्री मनोज कुमार (जिला मजिस्ट्रेट / DM)' : 'Shri Manoj Kumar (District DM / Collector)'}</span>
                      <span className="text-[9px] font-mono text-stone-500 block font-normal mt-0.5">{lang === 'hi' ? 'सभी ग्राम पंचायतें संचालित करें, सदस्य सत्यापित करें, नए गाँव जोड़ें' : 'Oversee all district panchayats, verify members, register villages'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Secure simulated credentials form */}
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-3.5 space-y-3 font-sans">
                <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">{lang === 'hi' ? 'नया खाता लॉगिन (OTP / Phone)' : 'Interactive Phone/OTP Verification'}</span>
                
                {!otpSentFlag ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 mb-1">{lang === 'hi' ? 'नाम' : 'Full Name'}</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Ram Chander"
                        value={regNameInput}
                        onChange={(e) => setRegNameInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 mb-1">{lang === 'hi' ? 'फ़ोन नंबर (Phone Number)' : '10-Digit Mobile'}</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 94500 00000"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl focus:outline-none focus:border-emerald-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-stone-500 mb-1">{lang === 'hi' ? 'भूमिका चुनें' : 'Desired Account Role'}</label>
                      <select
                        value={userRegisterType}
                        onChange={(e: any) => setUserRegisterType(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-2 text-xs rounded-xl text-stone-300"
                      >
                        <option value="Resident">{lang === 'hi' ? 'ग्रामीण सदस्य (Villager)' : 'Resident'}</option>
                        <option value="Gram Pradhan">{lang === 'hi' ? 'ग्राम प्रधान (Village Head)' : 'Gram Pradhan'}</option>
                      </select>
                    </div>

                    {/* Dynamic state / district / village selector */}
                    <div className="bg-stone-900 border border-stone-850/60 p-3 rounded-2xl space-y-2 text-xs">
                      <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider select-none">
                        {lang === 'hi' ? 'निवास स्थान का चयन करें' : 'Select Registration Location'}
                      </span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 mb-0.5">{lang === 'hi' ? 'राज्य (State)' : 'State'}</label>
                          <select
                            value={signupState}
                            onChange={(e) => {
                              const s = e.target.value;
                              setSignupState(s);
                              const districts = getDistricts(s);
                              const firstDist = districts[0] || '';
                              setSignupDistrict(firstDist);
                              const villagesList = villages.filter(v => v.state === s && v.district === firstDist);
                              if (villagesList.length > 0) {
                                setSignupVillageId(villagesList[0].id);
                              }
                            }}
                            className="w-full bg-stone-950 border border-stone-850 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none focus:border-emerald-800"
                          >
                            {statesList.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 mb-0.5">{lang === 'hi' ? 'जिला (District)' : 'District'}</label>
                          <select
                            value={signupDistrict}
                            onChange={(e) => {
                              const d = e.target.value;
                              setSignupDistrict(d);
                              const villagesList = villages.filter(v => v.state === signupState && v.district === d);
                              if (villagesList.length > 0) {
                                setSignupVillageId(villagesList[0].id);
                              }
                            }}
                            className="w-full bg-stone-950 border border-stone-850 p-1.5 text-[10px] rounded text-stone-300 focus:outline-none focus:border-emerald-800"
                          >
                            {signupDistrictsList.map(dt => (
                              <option key={dt} value={dt}>{dt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {!isAddCustomVillage ? (
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="block text-[8px] uppercase font-mono tracking-wider text-stone-500">{lang === 'hi' ? 'सक्रिय पंचायत' : 'Gram Panchayat'}</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddCustomVillage(true);
                                setCustomVillageState(signupState);
                                setCustomVillageDistrict(signupDistrict);
                              }}
                              className="text-[8px] text-emerald-400 hover:text-emerald-300 uppercase font-mono font-bold"
                            >
                              + {lang === 'hi' ? 'नया गाँव पंजीकृत करें' : 'Add Custom Village'}
                            </button>
                          </div>
                          <select
                            value={signupVillageId}
                            onChange={(e) => setSignupVillageId(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-1.5 text-[10px] rounded text-[#FAF9F6] focus:outline-none focus:border-emerald-800"
                          >
                            {signupVillagesList.map(vl => (
                              <option key={vl.id} value={vl.id}>{vl.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1.5 border-t border-stone-800/40 pt-1.5 animate-fade-in">
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="block text-[8px] uppercase font-mono tracking-wider text-rose-400 font-bold">{lang === 'hi' ? 'नया गांव का नाम दर्ज करें' : 'Enter Custom Village Name'}</label>
                            <button
                              type="button"
                              onClick={() => setIsAddCustomVillage(false)}
                              className="text-[8px] text-stone-450 hover:text-stone-300 uppercase font-mono"
                            >
                              {lang === 'hi' ? 'वापस सूची चुनें' : 'Back to selection'}
                            </button>
                          </div>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Rampur Chanderpur"
                            value={customVillageName}
                            onChange={(e) => setCustomVillageName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 p-1.5 text-[10px] rounded focus:outline-none text-[#FAF9F6] placeholder-stone-650"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-bold uppercase text-[10.5px] font-mono tracking-wider cursor-pointer"
                    >
                      {lang === 'hi' ? 'ओटीपी प्राप्त करें' : 'Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-3.5 text-xs animate-fade-in">
                    <p className="text-[10.5px] text-emerald-400 font-semibold font-mono">
                      {lang === 'hi' ? `[पुष्टि कोड एसएमएस भेजा गया] ओटीपी के तौर पर 1234 का उपयोग करें:` : `Verification code sent. Enter mock OTP: 1234`}
                    </p>
                    <div>
                      <input 
                        type="text" 
                        required
                        maxLength={4}
                        placeholder="Enter 4-Digit Code"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 p-2.5 text-center text-sm font-mono tracking-widest rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 text-center">
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        {lang === 'hi' ? 'ओटीपी सत्यापित करें' : 'Verify Code'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpSentFlag(false)}
                        className="px-4 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-stone-400 hover:text-white"
                      >
                        {lang === 'hi' ? 'रद्द' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {currentUser && (
                <div className="bg-stone-950 border border-stone-850 p-3 rounded-2xl space-y-1 text-center font-mono text-[10.5px]">
                  <span className="text-stone-500 font-bold block">{lang === 'hi' ? 'सक्रिय लॉगिन विवरण' : 'ACTIVE CREDENTIAL KEY'}</span>
                  <p className="text-emerald-400 block font-bold mt-1 uppercase">{currentUser.name} ({currentUser.role})</p>
                  <p className="text-stone-400 font-mono mt-0.5">{currentUser.phone}</p>
                </div>
              )}

            </div>
          )}

          </>
          )}

        </div>

        {/* F. MODAL WIDGET: ISSUE RESOLUTION DOCK FOR VALUE UPDATES */}
        {selectedIncidentForUpdate && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
            <div className="bg-stone-900 border border-stone-800 rounded-[28px] w-full max-w-sm p-4 space-y-4 shadow-2xl">
              
              <div className="flex justify-between items-center border-b border-stone-800 pb-2 select-none">
                <div>
                  <span className="text-[9.5px] uppercase font-mono tracking-wider text-stone-500 font-bold">Panchayat Administration</span>
                  <h4 className="font-extrabold text-[#FAF9F6] text-xs leading-none mt-0.5">{lang === 'hi' ? 'कार्यवाही रिपोर्ट दर्ज करें' : 'Complaint Dispatch Matrix'}</h4>
                </div>
                <button 
                  onClick={() => setSelectedIncidentForUpdate(null)} 
                  className="p-1 text-stone-400 hover:text-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-950 p-2 text-[11px] rounded-xl border border-stone-850 font-medium">
                <span className="text-emerald-500 font-bold block mb-0.5">Title:</span>
                <span className="text-stone-300 leading-relaxed block">{selectedIncidentForUpdate.title}</span>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-3.5">
                
                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'अद्यतित स्थिति चुनें' : 'Resolution Stage'}</label>
                  <select
                    value={updatedStatus}
                    onChange={(e: any) => setUpdatedStatus(e.target.value as IncidentStatus)}
                    className="w-full bg-stone-950 border border-stone-800 p-2 rounded-xl text-stone-300 focus:outline-none"
                  >
                    <option value="Investigating">{lang === 'hi' ? 'निरीक्षण जारी (Investigating)' : 'Investigating'}</option>
                    <option value="Scheduled">{lang === 'hi' ? 'कार्य सुपुर्द (Scheduled)' : 'Scheduled / Assigned'}</option>
                    <option value="Resolved">{lang === 'hi' ? 'समस्या का समाधान (Resolved ✓)' : 'Resolved ✓ (Sends WhatsApp SMS)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-stone-500 font-bold mb-1">{lang === 'hi' ? 'कार्यवाही नोट्स लिखों' : 'Dispatcher Dispatch Note'}</label>
                  <textarea
                    rows={3}
                    required
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder={lang === 'hi' ? 'लिखें कि समस्या कैसे दूर की गई...' : 'e.g., Transformer fuse safely replaced. Power lines isolated and re-anchored.'}
                    className="w-full bg-stone-950 border border-stone-800 p-2 rounded-xl text-stone-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="bg-stone-950 border border-stone-850/60 p-2 rounded-xl text-[10px] text-stone-400 font-mono leading-snug">
                  📌 {lang === 'hi' ? 'समाधान (Resolved) करने पर, झापियर/मेक वर्कफ़्लो एक्टिवेट होगा जो रिपोर्ट दर्ज करने वाले ग्रामीण को ऑटोमेटिकली व्हाट्सएप / एसएमएस अलर्ट भेज देगा।' : 'Choosing "Resolved" acts as a Zapier trigger webhook to dispatch automated WhatsApp confirmation SMS to reporter.'}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-bold uppercase text-[10.5px] tracking-wide cursor-pointer text-center"
                  >
                    {lang === 'hi' ? 'अपडेट सुरक्षित करें' : 'Dispatch Action Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIncidentForUpdate(null)}
                    className="px-4 py-2 bg-stone-950 border border-stone-850 hover:bg-stone-900 text-stone-400 rounded-xl font-bold text-[10.5px]"
                  >
                    {lang === 'hi' ? 'रद्द' : 'Cancel'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* G. BOTTOM NAVIGATION SYSTEMS BAR */}
        {currentUser && (
          <nav className="bg-stone-950 border-t border-stone-880 py-3 shrink-0 relative z-40 select-none">
            <div className="max-w-2xl mx-auto grid grid-cols-5 text-center text-stone-400 text-xs gap-1.5 px-4">
              
              <button
                onClick={() => { setActiveTab('home'); setCommentText(''); }}
                className={`flex flex-col items-center justify-center cursor-pointer transition py-1 rounded-xl ${
                  activeTab === 'home' ? 'text-emerald-400 font-bold bg-stone-900/60' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Smartphone className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] tracking-tight">{t.homeTab}</span>
              </button>

              <button
                onClick={() => { setActiveTab('report'); setCommentText(''); }}
                className={`flex flex-col items-center justify-center cursor-pointer transition py-1 rounded-xl ${
                  activeTab === 'report' ? 'text-emerald-400 font-bold bg-stone-900/60' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Plus className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] tracking-tight">{lang === 'hi' ? 'शिकायत' : 'Report'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('market'); setCommentText(''); }}
                className={`flex flex-col items-center justify-center cursor-pointer transition py-1 rounded-xl ${
                  activeTab === 'market' ? 'text-emerald-400 font-bold bg-stone-900/60' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] tracking-tight">{lang === 'hi' ? 'मंडी' : 'Market'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('groups'); setCommentText(''); }}
                className={`flex flex-col items-center justify-center cursor-pointer transition py-1 rounded-xl ${
                  activeTab === 'groups' ? 'text-emerald-400 font-bold bg-stone-900/60' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Users className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] tracking-tight">{lang === 'hi' ? 'चौपाल' : 'Groups'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('profile'); setCommentText(''); }}
                className={`flex flex-col items-center justify-center cursor-pointer transition py-1 rounded-xl ${
                  activeTab === 'profile' ? 'text-emerald-400 font-bold bg-stone-900/60' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <User className="w-4.5 h-4.5 mb-1" />
                <span className="text-[10px] tracking-tight">{lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
              </button>

            </div>
          </nav>
        )}

      </div>

    </div>
  );
}
