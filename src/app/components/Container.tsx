interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="
  max-w=[1920px]
  min-w=[360px]
  md:min-w=[200px]
  mx-auto
  xl:px-20
  md:px-2
  px-4
  "
    >
      {children}
    </div>
  );
};

export default Container;
