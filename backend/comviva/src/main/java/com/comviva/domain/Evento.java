package com.comviva.domain;

import java.time.LocalDateTime;
import com.comviva.enums.NivelEvento;
import com.comviva.enums.StatusEvento;
import jakarta.persistence.*;


@Entity
@Table(name = "evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nome;

    @Column
    private String descricao;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @Column(name = "data_hora_fim")
    private LocalDateTime dataHoraFim;

    @Column(name = "capacidade_min")
    private Long capacidadeMin;

    @Column(name = "capacidade_max")
    private Long capacidadeMax;

    @Column
    private String endereco;

    @Enumerated(EnumType.STRING) 
    @Column
    private StatusEvento status;

    @Enumerated(EnumType.STRING) 
    @Column
    private NivelEvento nivel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategoria_id")
    private Subcategoria subcategoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criador_id")
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }      
    public Long getCapacidadeMin() {
        return capacidadeMin;
    }

    public void setCapacidadeMin(Long capacidadeMin) {
        this.capacidadeMin = capacidadeMin;
    }

    public Long getCapacidadeMax() {
        return capacidadeMax;
    }

    public void setCapacidadeMax(Long capacidadeMax) {
        this.capacidadeMax = capacidadeMax;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public StatusEvento getStatus() {
        return status;
    }

    public void setStatus(StatusEvento status) {
        this.status = status;
    }

    public NivelEvento getNivel() {
        return nivel;
    }

    public void setNivel(NivelEvento nivel) {
        this.nivel = nivel;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Subcategoria getSubcategoria() {
        return subcategoria;
    }

    public void setSubcategoria(Subcategoria subcategoria) {
        this.subcategoria = subcategoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }    
}
