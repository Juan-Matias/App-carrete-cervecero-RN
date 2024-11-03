
import { AntDesign, Ionicons,FontAwesome6, Feather} from '@expo/vector-icons';

export const icons = {
  Home: (props) => <AntDesign name='home' size={26} {...props} />,
  Cart: (props) => <AntDesign name='shoppingcart' size={26} {...props} />,
  Profile: (props) => <FontAwesome6 name='user' size={26} {...props} />,
  Orders: (props) => <Feather name='book-open' size={26} {...props} />,
  Products: (props) => <Ionicons name='briefcase-outline' size={26} {...props} />
};
