type Props = {
  className?: string
}

export const Otomo = (props: Props) => {
  return <img className={props.className} src={'/otomo.svg'} alt={''} />
}
