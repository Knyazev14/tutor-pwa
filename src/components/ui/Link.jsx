import { Link as RouterLink } from 'react-router-dom';

const variants = {
  // Обычная ссылка (для текста)
  base: 'text-gray-600 hover:text-primary-600 transition-colors duration-300',
  
  // Навигационная ссылка (для меню)
  nav: 'text-white hover:text-white hover:bg-primary-600/20 px-4 py-2 rounded-full transition-all duration-300 inline-flex items-center font-medium',

  // Навигационная ссылка в сайдбарк
  navAside: 'w-full text-left px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors duration-200 flex items-center gap-3 border-t border-gray-100 mt-1 pt-2',

  // Ссылка в подвале
  footer: 'text-gray-400 hover:text-primary-500 transition-colors duration-300 text-sm',
  
  // Подчеркнутая ссылка (для акцента)
  underlined: 'text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline transition-all duration-300 font-medium',
  
  // Ссылка-кнопка (выглядит как кнопка, но ведет как ссылка)
  button: 'inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium',
  
  // Контурная ссылка-кнопка
  buttonOutlined: 'inline-flex items-center justify-center border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium',
  
  // Ссылка в карточке
  card: 'text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 group',
  
  // Ссылка для хлебных крошек
  breadcrumb: 'text-gray-500 hover:text-primary-600 transition-colors duration-300 text-sm',
  
  // Активная ссылка (для текущей страницы)
  active: 'text-primary-600 font-semibold cursor-default',
  
  // Ссылка с иконкой (для социальных сетей)
  social: 'text-gray-500 hover:text-primary-600 transition-colors duration-300',
};

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

function Link({ 
  children, 
  to, 
  variant = 'base', 
  size = 'md',
  className = '', 
  icon,
  iconPosition = 'left',
  disabled = false,
  external = false,
  ...props 
}) {
  const baseClasses = `
    ${variants[variant]} 
    ${sizes[size]}
    inline-flex items-center 
    transition-all duration-300
    ${disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}
    ${className}
  `;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      {variant === 'card' && <span className="group-hover:translate-x-1 transition-transform">→</span>}
    </>
  );

  if (external) {
    return (
      <a
        href={to}
        className={baseClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <RouterLink
      to={disabled ? '#' : to}
      className={baseClasses}
      {...props}
    >
      {content}
    </RouterLink>
  );
}

export default Link;