from typing import Optional
from openai import OpenAI
from anthropic import Anthropic
from app.config import settings

class AIContentGenerator:
    def __init__(self):
        print(f"🤖 Initializing AIContentGenerator...")
        print(f"🤖 OPENAI_API_KEY present: {bool(settings.OPENAI_API_KEY)}")
        print(f"🤖 ANTHROPIC_API_KEY present: {bool(settings.ANTHROPIC_API_KEY)}")
        
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None
        
        print(f"🤖 OpenAI client created: {self.openai_client is not None}")
        print(f"🤖 Anthropic client created: {self.anthropic_client is not None}")
    
    def _build_system_prompt(self, content_type: str, tone: str, length: str) -> str:
        """Build the system prompt based on content parameters."""
        content_map = {
            "blog": "blog post",
            "email": "marketing email",
            "social": "social media post"
        }
        
        length_map = {
            "short": "Keep it concise (1-2 short paragraphs or 100-200 words).",
            "medium": "Make it moderate length (3-4 paragraphs or 300-500 words).",
            "long": "Make it comprehensive (5+ paragraphs or 600-1000 words)."
        }
        
        return f"""You are a professional marketing copywriter AI. You write {content_map.get(content_type, 'content')} in a {tone} tone.
{length_map.get(length, '')}
Output only the final content, no explanations or meta-commentary. Make it engaging and actionable."""
    
    def _build_user_prompt(self, product: str, audience: str, extra_instructions: Optional[str] = None) -> str:
        """Build the user prompt with product and audience details."""
        prompt = f"Product/Brand: {product}\nTarget Audience: {audience}"
        if extra_instructions:
            prompt += f"\n\nAdditional Instructions: {extra_instructions}"
        return prompt
    
    async def generate_with_openai(
        self,
        content_type: str,
        tone: str,
        length: str,
        product: str,
        audience: str,
        extra_instructions: Optional[str] = None
    ) -> tuple[str, str]:
        """Generate content using OpenAI GPT."""
        if not self.openai_client:
            raise ValueError("OpenAI API key not configured")
        
        system_prompt = self._build_system_prompt(content_type, tone, length)
        user_prompt = self._build_user_prompt(product, audience, extra_instructions)
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content
        model_used = response.model
        
        return content, model_used
    
    async def generate_with_claude(
        self,
        content_type: str,
        tone: str,
        length: str,
        product: str,
        audience: str,
        extra_instructions: Optional[str] = None
    ) -> tuple[str, str]:
        """Generate content using Anthropic Claude."""
        if not self.anthropic_client:
            raise ValueError("Anthropic API key not configured")
        
        system_prompt = self._build_system_prompt(content_type, tone, length)
        user_prompt = self._build_user_prompt(product, audience, extra_instructions)
        
        response = self.anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        content = response.content[0].text
        model_used = response.model
        
        return content, model_used
    
    async def generate(
        self,
        content_type: str,
        tone: str,
        length: str,
        product: str,
        audience: str,
        extra_instructions: Optional[str] = None,
        preferred_model: str = "openai"
    ) -> tuple[str, str]:
        """Generate content using the preferred AI model."""
        
        # FOR DEMO/TESTING: Use mock content if no API keys are configured
        if not self.openai_client and not self.anthropic_client:
            print("⚠️  No API keys configured - using MOCK content for demo")
            mock_content = self._generate_mock_content(content_type, tone, product, audience)
            return mock_content, "mock-demo-model"
        
        try:
            if preferred_model == "openai" and self.openai_client:
                return await self.generate_with_openai(
                    content_type, tone, length, product, audience, extra_instructions
                )
            elif preferred_model == "claude" and self.anthropic_client:
                return await self.generate_with_claude(
                    content_type, tone, length, product, audience, extra_instructions
                )
            else:
                # Fallback to any available client
                if self.openai_client:
                    return await self.generate_with_openai(
                        content_type, tone, length, product, audience, extra_instructions
                    )
                elif self.anthropic_client:
                    return await self.generate_with_claude(
                        content_type, tone, length, product, audience, extra_instructions
                    )
                else:
                    raise ValueError("No AI API keys configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY")
        except Exception as e:
            raise Exception(f"AI generation failed: {str(e)}")
    
    def _generate_mock_content(self, content_type: str, tone: str, product: str, audience: str) -> str:
        """Generate mock content for demo purposes when no API key is available."""
        templates = {
            "blog": f"""# {product}: A Game-Changer for {audience}

In today's fast-paced world, {audience} are constantly looking for innovative solutions. Enter {product} - a revolutionary offering that's transforming the landscape.

## Why {product} Matters

{product} addresses key challenges faced by {audience} with its unique approach. Here's what makes it special:

- **Innovative Design**: Built with {audience} in mind
- **User-Friendly**: Easy to implement and use
- **Results-Driven**: Proven track record of success

## The Impact

Organizations using {product} have reported significant improvements in efficiency and satisfaction. {audience} particularly appreciate how it simplifies complex processes.

## Getting Started

Ready to experience the difference? {product} is designed to help {audience} achieve their goals faster and more effectively.

*This is demo content. Configure OpenAI or Anthropic API keys for AI-generated content.*""",
            
            "social": f"""🚀 Exciting news for {audience}!

Introducing {product} - the solution you've been waiting for! 

✨ Perfect for {audience} who want to:
• Save time
• Increase efficiency  
• Achieve better results

Join thousands who have already made the switch! 

#{product.replace(' ', '')} #{audience.replace(' ', '')} #Innovation

[Demo content - Add API key for real AI generation]""",
            
            "email": f"""Subject: Discover How {product} Can Transform Your Workflow

Hi there,

I wanted to reach out to {audience} like you who are looking for better solutions.

{product} is designed specifically with your needs in mind. Here's what you can expect:

• Streamlined processes
• Time-saving features
• Measurable results

Many {audience} have already experienced the benefits. Here's what one customer said:

"{product} changed the way we work. Highly recommended!"

Ready to learn more? Click here to get started.

Best regards,
The {product} Team

---
Demo content - Configure OpenAI/Anthropic API keys for AI-powered generation.""",
        }
        
        return templates.get(content_type, f"""**{product} for {audience}**

This is demo content showcasing {product}. It's tailored for {audience} and demonstrates the platform's capabilities.

Key benefits:
- Professional quality
- Quick delivery
- Customizable output

To generate real AI-powered content, please configure your OpenAI or Anthropic API key in the backend/.env file.

Content type: {content_type}
Tone: {tone}""")

# Lazy singleton - will be initialized on first use
_ai_generator_instance = None

def get_ai_generator():
    """Get or create the AI generator singleton."""
    global _ai_generator_instance
    if _ai_generator_instance is None:
        print("🚀 Creating AI generator instance for the first time...")
        _ai_generator_instance = AIContentGenerator()
    return _ai_generator_instance
