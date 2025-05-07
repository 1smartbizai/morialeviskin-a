
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, MessageSquare, ChartBar, Calendar, Lightbulb } from "lucide-react";
import LandingFeatureCard from "@/components/landing/LandingFeatureCard";
import LandingTestimonial from "@/components/landing/LandingTestimonial";
import LandingFaq from "@/components/landing/LandingFaq";
import AppScreensShowcase from "@/components/landing/AppScreensShowcase";
import LeadForm from "@/components/landing/LeadForm";

// Placeholder data for app screens
const appScreens = [
  { image: "/placeholder.svg", title: "לוח בקרה" },
  { image: "/placeholder.svg", title: "ניהול לקוחות" },
  { image: "/placeholder.svg", title: "יומן פגישות" },
  { image: "/placeholder.svg", title: "נתוני מכירות" },
  { image: "/placeholder.svg", title: "תקשורת אוטומטית" },
];

// Testimonials data
const testimonials = [
  {
    quote: "המערכת של Bellevo חסכה לי שעות של עבודה אדמיניסטרטיבית. הכל מאורגן במקום אחד וקל מאוד לשימוש.",
    author: "מיטל כהן",
    role: "בעלת עסק",
    businessType: "קוסמטיקה",
    rating: 5
  },
  {
    quote: "הממשק למובייל מאפשר לי לנהל את העסק מכל מקום. הלקוחות מרוצים מהתזכורות האוטומטיות והאפשרות לקבוע תור בקלות.",
    author: "שירה לוי",
    role: "מעצבת שיער",
    businessType: "עיצוב שיער",
    rating: 5
  },
  {
    quote: "האפליקציה שינתה לחלוטין את האופן שבו אני מנהלת את העסק שלי. בזכות התובנות שהמערכת מספקת, הצלחתי להגדיל את ההכנסות ב-30%.",
    author: "נועה ברק",
    role: "בעלת סטודיו",
    businessType: "עיצוב ציפורניים",
    rating: 5
  },
];

// FAQ data
const faqs = [
  {
    question: "האם אני חייבת להתחייב לתקופה ארוכה?",
    answer: "לא, Bellevo מציעה מספר תוכניות גמישות, כולל אפשרות לתשלום חודשי ללא התחייבות."
  },
  {
    question: "האם המערכת עובדת גם במובייל?",
    answer: "כן, Bellevo מותאמת באופן מלא למובייל ומאפשרת לך לנהל את העסק שלך מכל מקום ובכל זמן."
  },
  {
    question: "כמה זמן לוקח להתחיל להשתמש במערכת?",
    answer: "ההתחלה מהירה מאוד. לאחר ההרשמה תוכלי להתחיל להשתמש במערכת תוך מספר דקות. צוות התמיכה שלנו זמין לעזור לך בכל שאלה."
  },
  {
    question: "האם ניתן לייבא את הלקוחות הקיימים שלי?",
    answer: "בהחלט! Bellevo מאפשרת ייבוא קל של רשימות לקוחות קיימות מקבצי אקסל או מערכות אחרות."
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-smartbiz-light">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="smartbiz-container flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Logo */}
            <div className="font-bold text-2xl text-smartbiz-primary">Bellevo</div>
            <div className="text-xs text-smartbiz-muted">by smartbizai – פתרונות חכמים לעסקים</div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Link to="/admin/login">
              <Button variant="outline" className="smartbiz-btn-secondary">
                כניסה לבעלות עסק קיימות
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="smartbiz-btn-primary">
                הקמת מערכת חדשה לבעלת עסק
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section with gradient background */}
      <section className="pt-32 pb-20 smartbiz-gradient-bg text-white">
        <div className="smartbiz-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in">
              אפליקציה אחת לניהול העסק שלך
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              אפליקציה אחת שמאגדת את כל מה שבעלת העסק צריכה – ניהול, תקשורת, אפליקציה חכמה. הכל במקום אחד.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/admin/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-white text-smartbiz-primary hover:bg-white/90 border-0">
                  כניסה לבעלות עסק קיימות
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-smartbiz-accent text-smartbiz-primary hover:bg-smartbiz-accent/90">
                  הקמת מערכת חדשה לבעלת עסק
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Curved shape at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
            <path fill="#F8F5FF" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,208C840,213,960,203,1080,181.3C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-smartbiz-light relative">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">כל מה שהעסק שלך צריך</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              Bellevo מספקת את כל הכלים הדרושים לניהול יעיל ומוצלח של העסק שלך, הכל בפלטפורמה אחת נוחה לשימוש
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LandingFeatureCard
              icon={Activity}
              title="מעקב לקוחות חכם"
              description="ניהול פרופילי לקוחות מתקדם עם היסטוריית טיפולים, העדפות אישיות ותובנות אוטומטיות"
            />
            <LandingFeatureCard
              icon={MessageSquare}
              title="תקשורת אוטומטית"
              description="שליחת הודעות תזכורת אוטומטיות, הצעות מותאמות אישית ועדכונים ללקוחות שלך"
            />
            <LandingFeatureCard
              icon={ChartBar}
              title="סקירת הכנסות"
              description="ניתוח מקיף של הביצועים הכספיים של העסק עם תרשימים ברורים ודוחות מפורטים"
            />
            <LandingFeatureCard
              icon={Calendar}
              title="ניהול יומן וטיפולים"
              description="יומן פגישות אינטואיטיבי, ניהול קל של טיפולים ומוצרים, ומערכת הזמנות מתקדמת"
            />
            <LandingFeatureCard
              icon={Lightbulb}
              title="תובנות עסקיות בינה מלאכותית"
              description="תובנות מבוססות בינה מלאכותית שעוזרות לך לקבל החלטות חכמות יותר ולמקסם רווחים"
            />
          </div>
        </div>
      </section>

      {/* App preview section */}
      <section className="py-20 bg-white">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">צפו במערכת בפעולה</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              גלו את הממשק האינטואיטיבי והתכונות החדשניות של Bellevo
            </p>
          </div>

          <AppScreensShowcase screens={appScreens} />
        </div>
      </section>

      {/* Video section (placeholder) */}
      <section className="py-20 bg-smartbiz-light relative">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">איך Bellevo עובדת</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              צפו בסרטון קצר המדגים כיצד Bellevo יכולה להפוך את ניהול העסק שלך לפשוט יותר
            </p>
          </div>

          <div className="max-w-3xl mx-auto aspect-video bg-white rounded-xl shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-smartbiz-dark/10 group-hover:bg-smartbiz-dark/20 transition-all cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-smartbiz-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <img src="/placeholder.svg" alt="Video thumbnail" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 bg-white">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">מה לקוחותינו אומרים</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              אלפי בעלות עסקים כבר נהנות מהיתרונות של Bellevo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <LandingTestimonial
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                businessType={testimonial.businessType}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20 bg-smartbiz-light">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">שאלות נפוצות</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              מצאו תשובות לשאלות הנפוצות ביותר על Bellevo
            </p>
          </div>

          <LandingFaq faqs={faqs} />
        </div>
      </section>

      {/* Lead form section */}
      <section className="py-20 bg-white relative">
        <div className="smartbiz-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">מעוניינים בהדגמה?</h2>
            <p className="text-smartbiz-muted max-w-2xl mx-auto">
              השאירו פרטים וצוות Bellevo יחזור אליכם בהקדם לקביעת פגישת הדגמה אישית
            </p>
          </div>

          <LeadForm />

          <div className="fixed bottom-4 left-4 md:hidden">
            <Button className="smartbiz-btn-primary rounded-full shadow-lg animate-pulse-gentle">
              רוצה הדגמה? לחצי כאן
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-smartbiz-dark text-white py-12">
        <div className="smartbiz-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-bold text-2xl mb-4">Bellevo</div>
              <div className="text-sm text-gray-400">
                פתרונות חכמים לניהול עסקים בתחום היופי והאסתטיקה
              </div>
              <div className="mt-4 text-sm text-gray-400">
                © {new Date().getFullYear()} smartbizai. כל הזכויות שמורות
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">ניווט מהיר</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">התכונות שלנו</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">תוכניות ומחירים</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">דוגמאות</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">מדריכים</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">צרו קשר</h3>
              <ul className="space-y-2">
                <li className="text-gray-300">contact@smartbizai.com</li>
                <li className="text-gray-300">03-123-4567</li>
                <li className="text-gray-300">רח' הברזל 3, תל אביב</li>
              </ul>
              <div className="flex mt-4 space-x-4 space-x-reverse">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127
                      C15.201,3.039,15.64,3,16.07,3c0.319,0,0.635,0.014,0.949,0.04c-0.254-0.021-0.51-0.031-0.77-0.03
                      c0.147,0,0.297,0.003,0.447,0.009v2.826c-0.843-0.001-1.687,0.013-2.53,0.042c-0.863,0.025-1.563,0.298-2.049,0.821
                      c-0.487,0.524-0.717,1.283-0.717,2.275v2.727h-3.374v3.209h3.124v8.078h2.777v-0.03H13.397z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2.162c3.204,0,3.584,0.012,4.849,0.07c1.308,0.06,2.655,0.358,3.608,1.311c0.962,0.962,1.251,2.296,1.311,3.608
                      c0.058,1.265,0.07,1.645,0.07,4.849c0,3.204-0.012,3.584-0.07,4.849c-0.059,1.301-0.364,2.661-1.311,3.608
                      c-0.962,0.962-2.295,1.251-3.608,1.311c-1.265,0.058-1.645,0.07-4.849,0.07c-3.204,0-3.584-0.012-4.849-0.07
                      c-1.291-0.059-2.669-0.371-3.608-1.311c-0.957-0.957-1.251-2.304-1.311-3.608c-0.058-1.265-0.07-1.645-0.07-4.849
                      c0-3.204,0.012-3.584,0.07-4.849c0.059-1.296,0.367-2.664,1.311-3.608c0.96-0.96,2.299-1.251,3.608-1.311
                      C8.416,2.174,8.796,2.162,12,2.162 M12,0C8.741,0,8.332,0.014,7.052,0.072C5.197,0.157,3.355,0.673,2.014,2.014
                      C0.668,3.36,0.157,5.2,0.072,7.052C0.014,8.332,0,8.741,0,12c0,3.259,0.014,3.668,0.072,4.948c0.085,1.853,0.603,3.7,1.942,5.038
                      c1.345,1.345,3.186,1.857,5.038,1.942C8.332,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072
                      c1.854-0.085,3.698-0.602,5.038-1.942c1.347-1.347,1.857-3.184,1.942-5.038C23.986,15.668,24,15.259,24,12
                      c0-3.259-0.014-3.668-0.072-4.948c-0.085-1.855-0.602-3.698-1.942-5.038c-1.343-1.343-3.189-1.858-5.038-1.942
                      C15.668,0.014,15.259,0,12,0"/>
                    <path d="M12,5.838c-3.403,0-6.162,2.759-6.162,6.162c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162
                      C18.162,8.597,15.403,5.838,12,5.838z M12,16c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16z"/>
                    <circle cx="18.406" cy="5.594" r="1.44"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <div className="mb-2">
              <a href="#" className="text-gray-400 hover:text-white mx-3">תנאי שימוש</a>
              <a href="#" className="text-gray-400 hover:text-white mx-3">מדיניות פרטיות</a>
            </div>
            <div>
              Bellevo הינה מערכת מבית smartbizai – פתרונות חכמים לעסקים
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
