"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type: "text" | "loading"
}

interface AIChatProps {
  isOpen: boolean
  onToggle: () => void
  onMinimize: () => void
}

export function AIChat({ isOpen, onToggle, onMinimize }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I can help you with inventory management, supplier queries, reports, and system operations. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    "Show low stock items",
    "Generate monthly report",
    "Find supplier contact",
    "Check inventory status",
    "Help with settings",
    "Best Recommendation"
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate placeholder API call
    setTimeout(() => {
      let aiContent = `I understand you're asking about "${inputValue}". This would be processed by our backend AI service to provide you with relevant information about your inventory management system.`
      if (inputValue.toLowerCase().includes("recommend")) {
        aiContent = "Best Recommendation: Consider restocking low inventory items and reviewing supplier performance for optimal operations."
      }
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: "ai",
        timestamp: new Date(),
        type: "text"
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="icon"
      >
        <Bot className="h-6" />
      </Button>
    )
  }

  return (
    <div className="flex flex-col h-[70vh] sm:h-[60vh] w-full">
      <div className="flex-1 overflow-y-auto">
        <Card className="shadow-none border-none h-full">
          <CardContent className="p-0 flex-col h-full">
            <ScrollArea className="flex-1 pb-2" ref={scrollAreaRef}>
              <div className="space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-xs">
                          {message.sender === "ai" ? <Bot className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4 text-gray-500" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm break-words ${message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                        style={{ wordBreak: 'break-word' }}
                      >
                        {message.type === "loading" ? (
                          <div className="flex items-center space-x-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>AI is thinking...</span>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2 max-w-[80%]">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="p-2 border-t bg-white dark:bg-gray-950">
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Quick Actions:</div>
          <div className="flex flex-wrap gap-1">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
        <form
          className="flex items-center space-x-2"
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 text-sm"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
} 