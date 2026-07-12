import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Trash2, Copy, CheckCheck, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatHistoryEntry } from '@/services/aiApi';
import { aiApi } from '@/services/aiApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "Summarize our ESG performance",
  "Which department has the highest emissions?",
  "What are our biggest governance risks?",
  "Which department has the lowest social score?",
  "What should we improve this quarter?",
];

export function AiChat({ history }: { history: ChatHistoryEntry[] }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load history
    const historicalMessages: Message[] = [];
    history.forEach(h => {
      historicalMessages.push({ id: `u-${h.id}`, role: 'user', content: h.userMessage, timestamp: new Date(h.timestamp) });
      historicalMessages.push({ id: `a-${h.id}`, role: 'assistant', content: h.aiResponse, timestamp: new Date(h.timestamp) });
    });
    if (historicalMessages.length === 0) {
      historicalMessages.push({
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your **EcoSphere AI Advisor**. I have access to your organization's live ESG data and can answer specific questions about your Environmental, Social, and Governance performance.\n\nTry asking me something like: *\"Which department has the highest carbon emissions?\"* or *\"What are our biggest compliance risks?\"*",
        timestamp: new Date(),
      });
    }
    return historicalMessages;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.chat(messageText);
      const aiMsg: Message = { id: `ai-${Date.now()}`, role: 'assistant', content: res.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: 'I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearChat = async () => {
    await aiApi.clearChatHistory();
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: "Chat history cleared! How can I help you analyze your ESG performance today?",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-[75vh] glass rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">ESG AI Advisor</p>
            <p className="text-xs text-green-500">● Live ESG data connected</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} title="Clear history">
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-gradient-to-br from-green-500 to-blue-500' : 'bg-muted border'}`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] group relative ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border rounded-tl-sm'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded-full p-1 shadow-sm"
                  >
                    {copied === msg.id ? <CheckCheck className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-1 px-1">{msg.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted/50 border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-b bg-muted/10 flex gap-2 overflow-x-auto">
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => sendMessage(p)} className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full border bg-background hover:bg-muted hover:border-green-500/50 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-green-500" /> {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your ESG performance..."
          className="min-h-[44px] max-h-32 resize-none bg-muted/30 border-muted focus:border-green-500/50"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          rows={1}
        />
        <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} size="icon" className="bg-green-500 hover:bg-green-600 h-[44px] w-[44px]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
